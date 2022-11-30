const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = 3001;

const mysql = require('mysql2');
const credentials = require('./serverCredentials.json');

let con = mysql.createConnection(credentials);

//connect to the sql database


//check if I will need to deal with the catch statement at the end in the rest of the code
async function query(sqlCommand, data) {
  let params = [sqlCommand];
  if(data !== undefined) params.push([data]);

  return await new Promise((resolve, reject) => {
    con.query(...params, function(err, result) {
      if(err) return reject(err);
      resolve(result);
    });
  }).catch(e => console.log(e));
}

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

user.get('', (req, res) => {
  //Authenticate user

});

user.get('/getAllUsers', authenticateToken, async (req, res) => {

  let users = await query("SELECT * FROM user;");

  res.json(users.filter(user => req.user.email === user.email));//returns only the user that is logged in
});

//this creates a user
user.post('/createAccount', async (req, res) => {
  //add some verification here to check if user exists, if the data is in proper format, etc
  //make sure that there is only one user
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    let result = await query("INSERT INTO user (email, userName, password, verifiedEmail, disabled) VALUES ?", [[req.body.email, req.body.userName, hashedPassword, false, true]])
    res.status(201).send(result);
  
  } catch {
    res.status(500).send();
  }
});

user.post('/login', async (req, res) => {
  //Add some validation, verification here to make sure the value passed in is in proper format
  const user = await query("SELECT * FROM user WHERE email='"+req.body.email+"';");
  if(user.length == 0) {
    return res.status(400).send('Cannot find user');
  }

  try {
    if(await bcrypt.compare(req.body.password, user[0].password)) {
      //the user exists
      const passUser = {id : user[0].id, email : user[0].email, userName : user[0].userName};
      console.log(passUser);
      const accessToken = jwt.sign(passUser, process.env.ACCESS_TOKEN_SECRET);
      res.json({accessToken : accessToken});

    } else {
      res.send('Not allowed');//this user dosn't exist
    }
  } catch(e){
    console.log(e);
    res.status(500).send();
  }
  

})
user.get('/test', (req, res)=> {
  res.json({message : "this is only for users that are logged in"});
})

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
app.use('/api/Account', user);


//connecting to database and starting server
new Promise ((resolve, reject) => {
  con.connect(async function(err) {
  if(err) reject(err);
  console.log("SQL Database Connected");
  resolve();
  })
}).then(() => {
  app.listen(port, () => {
    console.log("Listening on port ", port);
  });
}).catch((err) => {
  console.log(err);
})

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];//undefined or token

  if(token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if(err) return res.setStatus(403);
    //the token is valid

    req.user = user;
    next();
  })

}