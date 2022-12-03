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
    if(playlistName === undefined || playlistName === null || playlistName === '') return res.status(400).send("playlist name is invalid");
    
    //check if the name already exists
    let result = await query("SELECT Count(*) AS count FROM playlist WHERE userID='" + req.user.id + "' AND name='" + playlistName + "' LIMIT 1;") 
    if(result.error !== undefined) {console.log(result.error);return res.status(500).send();}
    if(result.result[0].count > 0) return res.status(400).send("This playlist already exists");

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
      if(result.error !== undefined) {console.log(result.error); return res.status(500).send()};

      return res.sendStatus(204);
    } catch (e){
      console.log(e);
      return res.sendStatus(500);
    }
  });

  user.get('/tracks/:playlistID', async (req, res) => {
    let id = req.params.playlistID;
    if(isNaN(id)) return res.status(400).json({error : "Please enter a number"});
    
    let result = await query(`SELECT userID FROM playlist WHERE id=${id};`);
    if(result.error !== undefined) return res.sendStatus(500);
    if(result.result.length == 0) return res.stauts(400).send({error : "This playlist doesn't exist."});
    if(result.result[0].userID !== req.user.id) return res.status(403).send({error : "This playlist is owned by another user."})
    
    let tracks = await query(`SELECT track.* FROM (SELECT * FROM playlistTrack WHERE playlistID=${id}) AS pTracks JOIN track WHERE pTracks.trackID = track.id;`);
    if(tracks.error !== undefined) return res.sendStatus(500);

    return res.json(tracks.result);
  })
}

exports.addLoggedInRoutes = addLoggedInRoutes;


function checkPasswordFormat(req, res, next) {
  let user = req.body;

  if(user === undefined) return res.status(400).json({error : "There are no email and password values"});
  if(user.password === undefined) return res.status(400).json({error : "there is no password field"});
  if(typeof user.password !== 'string' && !(user.password instanceof String)) return res.status(400).json({error : "Please enter a string for the email"});
  if(user.password === '') return res.status(400).json({error : "There is no password value"});
  if(user.password.length > 72) return res.status(400).json({error : "max character length for the password is 72 characters"});

  next();
}
