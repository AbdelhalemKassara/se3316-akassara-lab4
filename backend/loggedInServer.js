const {query, startDatabaseConnection, UTCtoSQLDate, CurSQLDate} = require('./databaseConnection');

function addLoggedInRoutes(user) {
  user.get('/getUserOnlyStuff', async (req, res) => {
    let user = await query("SELECT id FROM user WHERE email='"+req.user.email+"';");
  
    res.json({message : "This should only be seen by a logged in user, here is your id.", id : user.result[0]["id"]});
  });
  
  user.get('/playlists', async (req, res) => {
  
    res.json(await query("SELECT * FROM playlist WHERE userID='" + req.user.id + "';"));
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
}

exports.addLoggedInRoutes = addLoggedInRoutes;