const jwt = require('jsonwebtoken');
require('dotenv').config();

const {query, UTCtoSQLDate} = require('./databaseConnection');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

function addAuthentication(userCred) {
  //this creates a user
  userCred.post('/createAccount',checkLoginFormat,checkEmailFormat, checkUserNameFormat, async (req, res) => {
    let user = req.body;
    //check if the user already exists
    let queryUser = await query("SELECT * FROM user WHERE email='" + req.body.email + "' LIMIT 1;");
    if(queryUser.error !== undefined && queryUser.result === undefined) return res.status(500).send();
    if(queryUser.result.length !== 0) return res.status(400).send('There is an account already created with this email.');

    
    //create the user
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      let insertUserResult = await query("INSERT INTO user (email, userName, password, verifiedEmail, disabled) VALUES ?", [[user.email, user.userName, hashedPassword, false, false]])
      if(insertUserResult.error !== undefined) return res.status(500).send();

      let createdUser = await query("SELECT * FROM user WHERE email='" + user.email + "';");
      if(createdUser.error !== undefined) return res.status(500).send();
      
      res.status(201).send(req.protocol + "://" + req.get('host') + '/api/account/verification/' + await generateAccountVerificationToken(createdUser.result[0]));
    } catch {
      res.status(500).send();
    }
  });

  //this is for email verification
  userCred.get('/verification/:jwt', async (req, res) => {
    //return a success message if that work and the keys

    jwt.verify(req.params.jwt, process.env.ACCOUNT_VERIFICATION_TOKEN_SECRET, async (err, user) => {
      if(err) return res.sendStatus(403); 

      let queryUser = await query("SELECT * FROM user WHERE id='" + user.id + "' LIMIT 1;");
      if(queryUser.error !== undefined) return res.status(500).send();
      if(queryUser.result.length == 0) return res.status(400).send('Cannot find user');

      queryUser = queryUser.result[0];
      let setVerificationQuery = await query("UPDATE user SET verifiedEmail=1 WHERE id='" + user.id + "';");
      
      if(setVerificationQuery.error !== undefined) return res.status(500).send();
      if(setVerificationQuery.result !== undefined) return res.status(200).send("Your account has been verified");//probably should redirect user back to homepage after a set time
    });
  });

  //this logs in a user
  userCred.post('/login', checkLoginFormat, checkEmailFormat, async (req, res) => {

    let user = await query("SELECT * FROM user WHERE email='"+req.body.email+"' LIMIT 1;");
    if(user.error !== undefined) return res.status(500).send();
    
    if(user.result.length == 0) return res.status(400).send('Cannot find user');
    user = user.result[0];

    //verifys the password
    try {
      if(await bcrypt.compare(req.body.password, user.password)) {
        //check if the user is disabled or if they haven't verified their email yet
        if(user.disabled) return res.status(403).send("User is currently disabled");
        if(!user.verifiedEmail) return res.status(403).send(req.protocol + "://" + req.get('host') + '/api/account/verification/' + await generateAccountVerificationToken(user));
        
        //the user exists
        const passUser = {id : user.id, email : user.email, userName : user.userName};

        const accessToken = await generateAccessToken(passUser);
        const refreshToken = await generateRefreshToken(passUser);

        res.json({accessToken : accessToken, refreshToken : refreshToken});

      } else {
        res.status(401).send('The password is incorrect');//the password is invalid
      }
    } catch{
      res.status(500).send();
    }
  });

  //this logs out a user account
  userCred.delete('/logout', async (req, res) => {
    //take in refresh token
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1];//undefined or token
  
    if(refreshToken === null || refreshToken === undefined || refreshToken === '') return res.sendStatus(401);//if there is no token passed in

    //add refresh token id to expiredJWT table
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
      if(err) return res.sendStatus(403);//if the token has already expired or invalid
      
      //check if the tokens have already been added to the database
      let result = await query("SELECT EXISTS (SELECT * FROM expiredJWT WHERE jti='"+ user.jti + "') AS bool;");
      if(result.error !== undefined) return res.status(500).send(); 
      if(result.result[0].bool == 1) return res.sendStatus(403)//if the token was already "logged out"

      //add the token to the expired tokens table
      result = await query("INSERT INTO expiredJWT (jti) VALUES ('" + user.jti + "');");
      if(result.error !== undefined) return res.status(500).send(); 
      result = await query("CREATE EVENT delete_token ON SCHEDULE AT '" + UTCtoSQLDate(user.exp) + "' DO DELETE FROM expiredJWT WHERE jti='" + user.jti + "';");
      if(result.error !== undefined) return res.status(500).send(); 

      return res.sendStatus(204);
    });    
  })

  //this gets a new access token
  userCred.post('/accesstoken', (req, res) => {
    //check if the refresh token has been expired

    //create new access token

    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1];//undefined or token

    if(refreshToken === null || refreshToken === undefined || refreshToken === '') return res.sendStatus(401);//if there is no token passed in
    

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
      if(err) return res.sendStatus(403);

      let result = await query("SELECT EXISTS (SELECT * FROM expiredJWT WHERE jti='"+ user.jti + "') AS bool;");
      if(result.result[0].bool == 1) return res.sendStatus(403)//check if we have the token
    
      const accessToken = await generateAccessToken({id : user.id, email : user.email, userName : user.userName});//get an access token
      return res.json({accessToken : accessToken});
    })
  })
}


exports.addAuthentication = addAuthentication;

function checkLoginFormat(req, res, next) {
  let user = req.body;
  if(user === undefined) return res.status(400).send("There are no email and password values");
  if(user.password === undefined) return res.status(400).send("there is no password field");
  if(user.email === undefined) return res.status(400).send("There is no email field");
  
  if(typeof user.email !== 'string' && !(user.email instanceof String)) return res.status(400).send("Please enter a string for the email");
  if(typeof user.password !== 'string' && !(user.password instanceof String)) return res.status(400).send("Please enter a string for the email");
  
  if(user.password === '') return res.status(400).send("There is no password value");
  if(user.email === '') return res.status(400).send("There is no email value");

  if(user.email.length > 320) return res.status(400).send("The email is too long");
  if(user.password.length > 72) return res.status(400).send("max character length for the password is 72 characters");
  
  next();
}

function checkEmailFormat(req, res, next) {
  email = req.body.email;
  if(!email.includes('@')) return res.status(400).send("this email doesn't contain a @ symbol");
  if(email.split('@')[0].length === 0) return res.status(400).send("this email doesn't contain a prefix");
  if(email.includes('..') || !(/.\../.test(email.split('@')[1]))) return res.status(400).send("this email doesn't contain a valid domian"); //checks if there are two dots next to eachother and if the email's dots have text on either side
  
  next();
}
function checkUserNameFormat(req, res, next) {
  userName = req.body.userName;
  if(userName === undefined) return res.status(400).send("There is no username field");
  if(typeof userName !== 'string' && !(userName instanceof String)) return res.status(400).send("Please enter a string for the username");
  if(userName === '') return res.status(400).send('There is no email value');
  if(userName.length > 100) return res.status(400).send('The username is too long');

  next();
}
 
async function generateAccessToken(user) {
  return await generateToken(process.env.ACCESS_TOKEN_SECRET, '15min', user);
}

async function generateAccountVerificationToken(user) {
  return await generateToken(process.env.ACCOUNT_VERIFICATION_TOKEN_SECRET, '15min', user);
}

async function generateRefreshToken(user) {
  return await generateToken(process.env.REFRESH_TOKEN_SECRET, '24h', user);
}

async function generateToken(SECRET, expiration, user) {
  let id = crypto.randomBytes(16).toString('hex');
  let result = await query("SELECT EXISTS (SELECT * FROM expiredJWT WHERE jti='"+ id + "') AS bool;");

  while(result.result[0].bool == 1) {
    id = crypto.randomBytes(16).toString('hex');
    result = await query("SELECT EXISTS (SELECT * FROM expiredJWT WHERE jti='"+ id + "') AS bool;");  
  }
  let userDetails = {id : user.id, email : user.email, userName : user.userName};
  return jwt.sign(userDetails, SECRET, {expiresIn : expiration, jwtid: id});
}