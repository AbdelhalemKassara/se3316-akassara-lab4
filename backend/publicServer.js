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
  router.get('/track/:id', (req, res) => {
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
  //given a playlist id it will return the tracks contained within it or an error message
  playlists.get('/tracks/:id', (req, res) => {
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