const {query, startDatabaseConnection, UTCtoSQLDate, CurSQLDate} = require('./databaseConnection');
const bcrypt = require('bcrypt');


function addLoggedInRoutes(user) {
  user.get('/getUserOnlyStuff', async (req, res) => {
    let user = await query("SELECT id FROM user WHERE email='"+req.user.email+"';");
  
    res.json({message : "This should only be seen by a logged in user, here is your id.", id : user.result[0]["id"]});
  });
  
  user.get('/playlists', async (req, res) => {
    //same thing as long query in the public server but not limiting the results by 10 and checking for user id
    let result = await query(`SELECT id AS playlistID, userName, name, dateLastChanged, publicVisibility, description, numOfTracks, duration, averageRating FROM 
    (SELECT res.id, userName, name, dateLastChanged, publicVisibility, description, numOfTracks, duration 
    FROM user JOIN (
    SELECT * 
    FROM playlist LEFT JOIN (
    SELECT COUNT(*) AS numOfTracks, SEC_TO_TIME(SUM(time_to_sec(duration))) AS duration, p.playlistID  
    FROM playlistTrack AS p 
    JOIN track AS t ON t.id = p.trackID GROUP BY p.playlistID) AS a ON a.playlistID = playlist.id 
    WHERE playlist.userID=${req.user.id}) AS res on res.userID = user.id ORDER BY dateLastChanged DESC) AS list
    LEFT JOIN (SELECT playlistID, AVG(rating) AS averageRating FROM playlistReview GROUP BY playlistID) AS ratings ON ratings.playlistID=list.id;
    `);
    if(result.error !== undefined) return res.sendStatus(500);

    res.json(result.result);
  });
  
  user.post('/createPlaylist', async(req, res) => {
    let playlistName = req.body.name;
    if(playlistName === undefined || playlistName === null || playlistName === '') return res.status(400).json({error : "please enter a playlist name."});
    if(typeof playlistName !== 'string' && !(playlistName instanceof String)) return res.status(400).json({error : "Please enter the playlist name as a string."})
    if(playlistName.length > 300) return res.status(400).json({error : "Playlist name is too long."});

    //check if the name already exists
    let result = await query("SELECT Count(*) AS count FROM playlist WHERE userID='" + req.user.id + "' AND name='" + playlistName + "' LIMIT 1;") 
    if(result.error !== undefined) return res.status(500).send();
    if(result.result[0].count > 0) return res.status(400).json({error : "This playlist already exists"});

    //check if the user already added max amount of playlists
    result = await query(`SELECT COUNT(*) AS count FROM playlist WHERE userID=${req.user.id};`);
    if(result.error !== undefined || !result.result || !result.result[0]) return res.status(500).send();
    if(result.result[0].count >= 20) return res.status(400).json({error : "You already have the maximum number of playlists."})

    result = await query("INSERT INTO playlist (name, userID, dateLastChanged, publicVisibility) VALUES ?", [[req.body.name, req.user.id, CurSQLDate(), false]]);
    if(result.error !== undefined) return res.status(500).send();

    return res.sendStatus(201);
  });
  user.get('/playlist/reviews/:id', async (req, res) => {
    let id = req.params.id;
    if(isNaN(id)) return res.status(400).send({error : "Please enter a number as playlist id"});
    
    //check if the playlist is public
    let result = await query("SELECT userID FROM playlist WHERE id="+ id + ';');
    if(result.error !== undefined) return res.sendStatus(500);
    if(result.result.length == 0) return res.status(404).json({error : "This playlist doesn't exist."});
    if(result.result[0].userID !== req.user.id) return res.status(403).json({error : "This playlist is owned by another user."});

    result = await query("SELECT playlistReview.*, user.userName FROM playlistReview JOIN user ON user.id=playlistReview.userID WHERE playlistID=" + id + ";");
    if(result.error !== undefined) return res.sendStatus(500);
    
    return res.status(200).json(result.result);
  });
  //this updates the user's password
  user.put('/changepassword',checkPasswordFormat, async (req, res) => {
    //update password
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      
      let result = await query("UPDATE user SET password='"+ hashedPassword + "' WHERE id=" + req.user.id + ";")
      if(result.error !== undefined) return res.status(500).send();

      return res.sendStatus(204);
    } catch (e){
      return res.sendStatus(500);
    }
  });

  user.get('/tracks/:id', checkPlaylistAndUserMatch, async (req, res) => {
    let id = req.params.id;

    let tracks = await query(`SELECT track.* FROM (SELECT * FROM playlistTrack WHERE playlistID=${id}) AS pTracks JOIN track WHERE pTracks.trackID = track.id;`);
    if(tracks.error !== undefined) return res.sendStatus(500);

    return res.json(tracks.result);
  });

  user.delete('/playlist/delete/:id',checkPlaylistAndUserMatch, async (req, res) => {
    let result = await query(`DELETE FROM playlist WHERE id=${req.params.id};`);
    if(result.error !== undefined) return res.sendStatus(500);  

    return res.sendStatus(200);
  });

  user.put('/playlist/update/:id', checkPlaylistAndUserMatch, async (req, res) => {
    //check if all the tracks are valid tracks
    const {name, description, tracks, publicVisibility} = req.body;
    const id = req.params.id;

    if(typeof name !== 'string' && !(name instanceof String)) return res.status(400).json({error : "Please enter a playlist name as a string."});
    if(typeof description !== 'string' && !(description instanceof String)) return res.status(400).json({error : "Please enter a playlist details as a string."});
    if(Array.isArray(tracks) && tracks.some((track) => isNaN(track))) return res.status(400).json({error : "Please enter the tracks as an array of numbers."});
    if(publicVisibility !== 0 && publicVisibility !== 1) return res.status(400).json({error : "Please enter either 1 or 0 as the public visibility."});

    if(name.length > 300) return res.status(400).json({error : "Playlist name is too long."});
    if(description.length > 1000) return res.status(400).json({error : "Description is too long."});
    
    if(tracks.length !== 0) {
      let {result, error} = await query(`SELECT COUNT(*) AS count FROM track WHERE id IN (?);`, tracks);
      if(error !== undefined) return res.sendStatus(500);
      if(result && result[0] && result[0].count !== tracks.length) return res.status(400).json({error : "There are some track id's that don't exists."});
    } 

    //updates playlist
    let result = await query(`UPDATE playlist SET publicVisibility=${publicVisibility}, name='${name}', description='${description}', dateLastChanged='${CurSQLDate()}' WHERE id=${id}`);
    if(result.error !== undefined) return res.sendStatus(500);

    //deletes all tracks from playlist
    result = await query(`DELETE FROM playlistTrack WHERE playlistID=${id}`);
    if(result.error !== undefined) return res.sendStatus(500);

    //add the tracks that were passed in
    if(tracks.length !== 0) {
      const listTracks = tracks.map((trackID) => [id, trackID]);
      result = await query(`INSERT INTO playlistTrack (playlistID, trackID) VALUES ?`, listTracks);
      if(result.error !== undefined) return res.sendStatus(500);
    }
   
    return res.sendStatus(201);
  });

  user.put('/playlist/review/:id',checkPlaylistAndUserNotMatch, async (req, res) => {
    const playlistID = req.params.id;
    const userID = req.user.id;
    const {review, rating} = req.body;

    if(isNaN(rating) && (rating < 0 || rating > 10)) return res.status(400).json({error : "Please enter a number for the rating that is from 0 to 10."});
    if(typeof review !== 'string' && !(review instanceof String)) return res.status(400).json({error : "Please enter the review as astring."});
    if(review.length > 1000) return res.status(400).json({error : "The review is too long."});

    //check if user already reviewd a playlist
    let result = await query(`SELECT EXISTS(SELECT * FROM playlistReview WHERE playlistID=${playlistID} AND userID=${userID}) AS 'exists';`);
    if(result.error !== undefined) {console.log(result.error);return res.sendStatus(500)};
    if(result && result.result && result.result[0].exists === 1) return res.status(400).json({error : "You have already created a review on this playlist."});

    let {error} = await query(`INSERT INTO playlistReview (playlistID, userID, review, rating) VALUES (?)`, [playlistID, userID, review, rating]);
    if(error !== undefined) {console.log(error); return res.sendStatus(500)};

    return res.sendStatus(201);
  });
}

exports.addLoggedInRoutes = addLoggedInRoutes;

async function checkPlaylistAndUserNotMatch(req, res, next) {
  let id = req.params.id;

  if(isNaN(id)) return res.status(400).json({error : "Please enter a number"});

  let result = await query(`SELECT userID FROM playlist WHERE id=${req.params.id}`);
  if(result.error !== undefined) return res.sendStatus(500);
  if(!result.result || !result.result[0] || !result.result[0].userID) return res.status(400).json({error : "This playlist doesn't exit"})
  if(result.result[0].userID === req.user.id) return res.status(403).send({error : "You can't create a review on a playlist you created."});


  next();
}
async function checkPlaylistAndUserMatch(req, res, next) {
  let id = req.params.id;

  if(isNaN(id)) return res.status(400).json({error : "Please enter a number"});

  let result = await query(`SELECT userID FROM playlist WHERE id=${req.params.id}`);
  if(result.error !== undefined) return res.sendStatus(500);
  if(!result.result || !result.result[0] || !result.result[0].userID) return res.status(400).json({error : "This playlist doesn't exit"})
  if(result.result[0].userID !== req.user.id) return res.status(403).send({error : "This playlist is owned by another user"});
  next();
}
function checkPasswordFormat(req, res, next) {
  let user = req.body;

  if(user === undefined) return res.status(400).json({error : "There are no email and password values"});
  if(user.password === undefined) return res.status(400).json({error : "there is no password field"});
  if(typeof user.password !== 'string' && !(user.password instanceof String)) return res.status(400).json({error : "Please enter a string for the email"});
  if(user.password === '') return res.status(400).json({error : "There is no password value"});
  if(user.password.length > 72) return res.status(400).json({error : "max character length for the password is 72 characters"});

  next();
}
