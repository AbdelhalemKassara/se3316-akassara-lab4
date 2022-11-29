const express = require('express');
const app = express();
const port = 3000;

const router = express.Router();
const playlists = express.Router();
const search = express.Router();


//Set up serving the front end code
app.use('/', express.static('frontEnd'));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });
  
router.use(express.json());

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

//*Put (create or replace)
//7.given a playlist id and set of tracks it will replace the tracks with the new ones or return an error message
playlists.put('/updateList/:id', (req, res) => {
});

//given a playlist id it will create a new playlist or return an error message
playlists.put('/newList/:id', (req, res) => {
});

//*Post (update or cancel)

//*Delete (delete)
playlists.delete('/removeList/:id', (req, res) => {
});



app.use('/api', router);
app.use('/api/playlists', playlists);
app.use('/api/search', search);

app.listen(port, () => {
    console.log("Listening on port ", port);
});
