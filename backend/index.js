const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const {query, startDatabaseConnection, UTCtoSQLDate, CurSQLDate} = require('./databaseConnection');
const {startAuthenticationServer} = require('./autenticationServer');

const app = express();
const port = 3001;

const router = express.Router();
const playlists = express.Router();
const search = express.Router();
const user = express.Router();

//Set up serving the front end code
/*app.use('/', express.static('frontEnd'));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });
  */

router.use(express.json());
user.use(authenticateToken);

user.get('/getUserOnlyStuff', async (req, res) => {
  let user = await query("SELECT id FROM user WHERE email='"+req.user.email+"';");

  res.json({message : "This should only be seen by a logged in user, here is your id.", id : user[0]["id"]});
});

user.get('/playlists', async (req, res) => {

  res.json(await query("SELECT * FROM playlist WHERE userID='" + req.user.id + "';"));
});

user.post('/createPlaylist', async(req, res) => {

  let result = await query("INSERT INTO playlist (name, userID, dateLastChanged, publicVisibility) VALUES ?", [[req.body.name, req.user.id, CurSQLDate(), false]]);
  console.log(result);
  res.sendStatus(201);
});

//*Get (retrieve)
router.get('/genres',(req, res) => {
});
//sends information about all the playlists
router.get('/playlists', (req, res) => {
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


app.use('/api', router);
app.use('/api/playlists', playlists);
app.use('/api/search', search);
app.use('/api/account', user);


startDatabaseConnection().then(() => {
  startAuthenticationServer();
  app.listen(port, () => {
    console.log("Main Server: Listening on port ", port);
  });
  
})

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];//undefined or token

  if(token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if(err) return res.sendStatus(403);//token is invalid
    //the token is valid

    req.user = user;
    next();
  })

}
