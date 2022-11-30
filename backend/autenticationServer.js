const bcrypt = require('bcrypt');
const crypto = require('crypto');
const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const {query, UTCtoSQLDate} = require('./databaseConnection');

const app = express();
const port = 3002;
const user = express.Router();
user.use(express.json());

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

//this logs in a user
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

      const accessToken = generateAccessToken(passUser);
      const refreshToken = jwt.sign(passUser, process.env.REFRESH_TOKEN_SECRET, {expiresIn : '24h', jwtid: crypto.randomBytes(16).toString('hex')});

      res.json({accessToken : accessToken, refreshToken : refreshToken});

    } else {
      res.send('Not allowed');//this user dosn't exist
    }
  } catch(e){
    console.log(e);
    res.status(500).send();
  }
  

})

user.delete('/logout', (req, res) => {
  let refreshToken = req.body.token;
  if(refreshToken == null) {
    return res.sendStatus(401);//not token has been passed
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
    if(err) {
      console.log(err);
      return res.sendStatus(403);
    } else {
      res.sendStatus(204);
    }

    await query("INSERT INTO expiredRefreshJWT (jti) VALUES ('" + user.jti + "');");
    await query("CREATE EVENT delete_token ON SCHEDULE AT '" + UTCtoSQLDate(user.exp) + "' DO DELETE FROM expiredRefreshJWT WHERE jti='" + user.jti + "';");
  });

})

user.post('/token', (req, res) => {
  const refreshToken = req.body.token;
  if(refreshToken == null) return res.sendStatus(401);//if there is no token passed in
  

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
    if(err) return res.sendStatus(403);

    let result = await query("SELECT EXISTS (SELECT * FROM expiredRefreshJWT WHERE jti='"+ user.jti + "') AS bool;");
    if(result[0].bool == 1) return res.sendStatus(403)//check if we have the token
  
    const accessToken = generateAccessToken({id : user.id, email : user.email, userName : user.userName});//get an access token
    res.json({accessToken : accessToken});
  })
})
app.use('/api/Account', user);


function startAuthenticationServer() {
  app.listen(port, () => {
    console.log("Authentication Server: Listening on port ", port);
  });
}
exports.startAuthenticationServer = startAuthenticationServer;

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn : '15min'})//set to 10-15 or 30min
}

