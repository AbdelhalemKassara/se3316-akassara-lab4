const {query, startDatabaseConnection, UTCtoSQLDate, CurSQLDate} = require('./databaseConnection');
const aboutMessage = require('./aboutMessage.json');
function addPublicRoutes(playlists, search, router) {
    //*Get (retrieve)
  router.get('/genres',(req, res) => {
  });
  //sends information about all the playlists
  router.get('/playlists', async (req, res) => {
    //this thing returns all the public playlist and gets their duration and number of tracks and gets the 10 most recently changed playlists
    let publicPlaylists = await query(`SELECT playlistID, userName, name, dateLastChanged, publicVisibility, description, numOfTracks, duration 
    FROM user JOIN (
    SELECT * FROM playlist LEFT JOIN (
    SELECT COUNT(*) AS numOfTracks, SEC_TO_TIME(SUM(time_to_sec(duration))) AS duration, p.playlistID  
    FROM playlistTrack AS p JOIN track AS t ON t.id = p.trackID GROUP BY p.playlistID) AS a ON a.playlistID = playlist.id 
    WHERE playlist.publicVisibility=1) AS res on res.userID = user.id ORDER BY dateLastChanged DESC LIMIT 10;`);

    if(publicPlaylists.error !== undefined) return res.status(500).send();

    res.json(publicPlaylists.result);
  });
  
  router.get('/about', (req, res) => {
    return res.json(aboutMessage);
  });

  //given a track id it will return a track or error message
  router.get('/tracks/:playlistId', async (req, res) => {
    let id = req.params.playlistId;
    if(isNaN(id)) return res.status(400).json({error : "Please enter a number"});

    let tracks = await query('SELECT track.* FROM (SELECT * FROM playlistTrack WHERE playlistID='+ id + ') AS pTracks JOIN track WHERE pTracks.trackID = track.id;');
    if(tracks.error !== undefined) return res.sendStatus(500);

    return res.json(tracks.result);
  });
  
  //given a track id it will return the track or an error message
  router.get('/track/:id', async (req, res) => {
    let id = req.params.id;
    if(isNaN(id)) return res.status(400).json({error : "Please enter a number"});

    let track = await query('SELECT * FROM track WHERE id=' + id);
    if(track.error !== undefined) return res.sendStatus(500);

    if(track.result.length === 0) return res.status(404).json({error : "This track id doesn't exist"});
    
    return res.json(track.result[0]);
    
  });
  
  router.get('/artist/:id', (req, res) => {
  });
  router.get('/album/:id', (req, res) => {
  });
  //given a name it will return a list of tracks and albums ids that match or an error message
  search.get('/track/:name', (req, res) => {
  });
  //given an artist name it will return a list of artists ids or an error message
  search.get('/artist/:name', (req, res) => {
  });


  //given a playlist id and set of tracks it will replace the tracks with the new ones or return an error message
  playlists.put('/updateList/:id', (req, res) => {
  });

  //given a playlist id it will create a new playlist or return an error message
  playlists.put('/newList/:id', (req, res) => {
  });

  //*Delete (delete)
  playlists.delete('/removeList/:id', (req, res) => {
  });
}

exports.addPublicRoutes = addPublicRoutes;