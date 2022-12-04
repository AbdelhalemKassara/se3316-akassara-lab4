const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const {startDatabaseConnection} = require('./databaseConnection');
const {addAuthentication} = require('./autenticationServer');
const {addLoggedInRoutes} = require('./loggedInServer');
const {addPublicRoutes} = require('./publicServer');

const app = express();
const port = 3000;

const router = express.Router();
const playlists = express.Router();
const search = express.Router();
const user = express.Router();
const userCred = express.Router();

//Set up serving the front end code
app.use('/', express.static('../frontend/build'));

/*app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });
  */

router.use(express.json());
user.use(authenticateToken);

//add routes for users that are logged in
addLoggedInRoutes(user);

//add public routes
addPublicRoutes(playlists, search, router);

//add routes for authentication
addAuthentication(userCred);

app.use('/api', router);
app.use('/api/playlists', playlists);
app.use('/api/search', search);
app.use('/api/account/loggedin', user);
app.use('/api/account', userCred);

startDatabaseConnection().then(async () => {
  app.listen(port, () => {
    console.log("Main Server: Listening on port ", port);
  });
  
})

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];//undefined or token

  if(token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if(err) return res.status(401).json({accessLevel : 'logged in user'});//token is invalid

    //the token is valid

    req.user = user;
    next();
  })

}
