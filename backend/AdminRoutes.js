const { query, DateToSQLDate } = require('./databaseConnection');
const AcceptableUsePolicy = require('./Documents/AcceptableUsePolicy.json');
const DMCAPolicy = require('./Documents/DMCAPolicy.json');
const SecurityAndPrivacyPolicy = require('./Documents/securityAndPrivacyPolicy.json');
const DMCATakedown = require('./Documents/DMCATakedown.json');

const fs = require('fs');

function addAdminRoutes(admin) {

  admin.get('/users', async (req, res) => {
    let {result, error} = await query(`SELECT id, verifiedEmail, disabled, userName, admin, email FROM user;`);
    if(error !== undefined) return res.sendStatus(500);

    return res.json(result);
  });

  admin.put('/userpermission', getMainAdminID, async (req, res) => {
    let {userID, admin} = req.body;

    if(userID === undefined || userID === null || isNaN(userID)) return res.send(400).json({error : "Please set the user id as a number"});
    if(admin !== 0 && admin !== 1) return res.status(400).json({error : "Please enter either 0 or 1 for the admin."});

    if(userID === req.adminID) return res.status(400).json({error : "You can't change the permissions of the main administrator."});

    let { error} = await query(`UPDATE user SET admin=${admin} WHERE id=${userID}`);
    if(error !== undefined) return res.sendStatus(500);

    return res.sendStatus(200);
  })
  
  admin.put('/disabled', getMainAdminID, async (req, res) => {
    let {userID, disabled} = req.body;

    if(userID === undefined || userID === null || isNaN(userID)) return res.send(400).json({error : "Please set the user id as a number"});
    if(disabled !== 0 && disabled !== 1) return res.status(400).json({error : "Please enter either 0 or 1 for the disabled."});
    
    if(userID === req.adminID) return res.status(400).json({error : "You can't disable the main administrator."});

    let { error } = await query(`UPDATE user SET disabled=${disabled} WHERE id=${userID}`);
    if(error !== undefined) return res.sendStatus(500);

    return res.sendStatus(200);
  });

  admin.put('/review/setdisable', async (req, res) => {
    let {reviewID, disabled} = req.body;
    if(isNaN(reviewID)) return res.status(400).json({error : "Please enter a valid number for the review id."});
    if(disabled !== 0 && disabled !== 1) return res.status(400).json({error : "Please enter either 0 or 1 for disabled."});

    //check if review exists
    let result = await query(`SELECT EXISTS (SELECT * FROM playlistReview WHERE reviewID=${reviewID}) AS 'exists';`);
    if(result.error) {console.log(result.error); return res.sendStatus(500);}
    if(!(result.result && result.result[0] && result.result[0].exists == 1)) return res.send(400).json({error : "Please enter an review id that exists."});

    //disable the review
    result = await query(`UPDATE playlistReview SET disabled=${disabled} WHERE reviewID=${reviewID}`);
    if(result.error) {console.log(result.error);return res.sendStatus(500);}

    return res.sendStatus(200);
   });

   admin.get('/reviews', async (req, res) => {
    if(req.query === undefined || req.query.userName === undefined) return res.status(400).json({error : "Please add a username to the query."})
      let userName = req.query.userName;
      if(typeof userName !== 'string' && !(userName instanceof String)) return res.send(400).json({error : "Please enter a string as the username"})

      let result;
      if(userName.length == 0) {
        result = await query(`SELECT reviewList.*, user.userName FROM 
        (SELECT playlistReview.*, playlist.name FROM playlistReview 
          JOIN playlist ON playlist.id=playlistReview.playlistID) AS reviewList 
          JOIN user ON user.id=reviewList.userID;`);
      } else {
        result = await query(`SELECT reviewList.*, user.userName FROM 
        (SELECT playlistReview.*, playlist.name FROM playlistReview 
          JOIN playlist ON playlist.id=playlistReview.playlistID) AS reviewList 
          JOIN user ON user.id=reviewList.userID WHERE user.userName LIKE '%${userName}%';`);
      }
      
      if(result.error !== undefined) return res.sendStatus(500);

      return res.json(result.result);
   });

   admin.put('/documents/acceptableusepolicy', (req, res) => {
      AcceptableUsePolicy.file = req.body.file;
      saveFile('./Documents/AcceptableUsePolicy.json', AcceptableUsePolicy);

      res.sendStatus(200);
   });

   admin.put('/documents/dmcapolicy', (req, res) => {
      DMCAPolicy.file = req.body.file;
      saveFile('./Documents/DMCAPolicy.json', DMCAPolicy);

      res.sendStatus(200);
   });

   admin.put('/documents/securityandprivacypolicy', (req, res) => {
    SecurityAndPrivacyPolicy.file = req.body.file;
    saveFile('./Documents/securityAndPrivacyPolicy.json', SecurityAndPrivacyPolicy);

    res.sendStatus(200);
   });

  admin.post('/dmcatakedown/logrequest', validateDateTimeNote, checkReviews, async (req, res) => {
    let vals = req.body;
    let result = await query(`INSERT INTO DMCARequest (dateRecived, note) VALUES (?)`, [DateToSQLDate(new Date(vals.year, vals.month-1, vals.day, vals.hour, vals.minute)), vals.note]);
    if(result.error !== undefined) return res.sendStatus(500);
    
    result = await query(`SELECT LAST_INSERT_ID() AS id;`);
    if(result.error !== undefined) return res.sendStatus(500);
    if(result.result[0] === undefined || result.result[0].id === undefined) return res.sendStatus(500);
    let reqID = result.result[0].id;

    result = await query(`INSERT INTO DMCAReviews (DMCARequestID, reviewID) VALUES ?`, vals.reviews.map(id => [reqID, id]));
    if(result.error !== undefined) return res.sendStatus(500);

    res.sendStatus(201);
  });

 
  admin.post('/dmcatakedown/lognotice/:id', validateDateTimeNote, validateRequest, async (req, res) => {
    let reqID = req.params.id;
    let vals = req.body;

    let { error} = await query(`INSERT INTO DMCANotice (DMCARequestID, dateSent, note) VALUES (?)`, [reqID,DateToSQLDate(new Date(vals.year, vals.month-1, vals.day, vals.hour, vals.minute)), vals.note ])
    if(error !== undefined) return res.sendStatus(500);

    res.sendStatus(201);
  });
  admin.post('/dmcatakedown/logdispute/:id', validateDateTimeNote, validateRequest, async (req, res) => {
    let reqID = req.params.id;
    let vals = req.body;

    let { error} = await query(`INSERT INTO DMCADispute (DMCARequestID, dateRecived, note) VALUES (?)`, [reqID,DateToSQLDate(new Date(vals.year, vals.month-1, vals.day, vals.hour, vals.minute)), vals.note ])
    if(error !== undefined) return res.sendStatus(500);

    res.sendStatus(201);

  });
  admin.put('/dmcatakedown/activaterequest/:id', validateRequest, async (req, res) => {
    let reqID = req.params.id;

    let {error} = await query(`UPDATE DMCARequest SET active=1 WHERE id=${reqID};`);
    if(error !== undefined) return res.sendStatus(500);

    res.sendStatus(200);
  });

  admin.put('/dmcatakedown/disactivaterequest/:id', validateRequest, async (req, res) => {
    let reqID = req.params.id;

    let {error} = await query(`UPDATE DMCARequest SET active=0 WHERE id=${reqID};`);
    if(error !== undefined) return res.sendStatus(500);

    res.sendStatus(200);
  });

  admin.get('/dmcatakedown/activerequests', async (req, res) => {
    let {result, error} = await query(`SELECT DMCARequest.*, DMCAReviews.reviewID FROM DMCARequest Left Join DMCAReviews ON DMCARequest.id=DMCAReviews.DMCARequestID WHERE active=1;`);
    if(error !== undefined) return res.sendStatus(500);

    return res.status(200).json(compressRequests(result));
  });
  admin.get('/dmcatakedown/disactivatedrequests', async (req, res) => {
    let {result, error} = await query(`SELECT DMCARequest.*, DMCAReviews.reviewID FROM DMCARequest LEFT JOIN DMCAReviews ON DMCARequest.id=DMCAReviews.DMCARequestID WHERE active=0;`);
    if(error !== undefined) return res.sendStatus(500);

    return res.status(200).json(compressRequests(result));

  });
  admin.get('/documents/dmcatakedown', async(req, res) => {
    return res.json(DMCATakedown);
  });
}
function compressRequests(result) {
  let out = new Map();
    result.forEach(val => {
      if(out.has(val.id)) {
        out.get(val.id).reviews.push(val.reviewID);

      } else {
        out.set(val.id, {...val, reviews : [val.reviewID]});
      }
    });

    return Array.from(out.values());
}
async function validateRequest(req, res, next) {
  if(isNaN(req.params.id)) return res.status(400).json({error : "Please enter the request as a number."});

  let {result, error} = await query(`SELECT EXISTS (SELECT * FROM DMCARequest WHERE id=${req.params.id}) AS 'exists'`);
  if(error !== undefined) return res.sendStatus(500);

  if(!result && !result[0] && result[0].exists === 0) return res.status(400).json({error : "This request id doesn't exist."});

  next();
}
function validateDateTimeNote(req, res, next) {
  let vals = req.body;
  if(vals === null || vals === undefined) return res.status(400).json({error : "The body is undefined or null."});

  if(isNaN(vals.year)) return res.status(400).json({error : "Please enter the year as a number"});
  if(isNaN(vals.month)) return res.status(400).json({error : "Please enter the month as a number"});
  if(isNaN(vals.day)) return res.status(400).json({error : "Please enter the day as a number"});
  if(isNaN(vals.hour)) return res.status(400).json({error : "Please enter the hour as a number"});
  if(isNaN(vals.minute)) return res.status(400).json({error : "Please enter the minute as a number"});

  if(vals.year < 1901 || vals.year > 2155) return res.status(400).json({error : "Please enter a year between 1901 and 2155"});
  if(vals.month < 1 || vals.month > 12) return res.status(400).json({error : "Please enter a month value from 1 to 12"});
  if(vals.day < 1 || vals.days > 31) return res.status(400).json({error : "Please enter a day from 1 to 31"});
  if(vals.hour < 0 || vals.hour > 24) return res.status(400).json({error : "Please enter an hour from 0 to 24"});

  if(typeof vals.note !== 'string' && !(vals.note instanceof String)) return res.status(400).json({error : "Please enter a string as the note"});
  if(vals.note.length > 1000) return res.status(400).json({ error : "Note is too long."});

  next();

}

async function checkReviews(req, res, next) {
  if(req.body === null || req.body === undefined) return res.status(400).json({error : "The body is undefined or null."});
  let reviews = req.body.reviews;
  if(!Array.isArray(reviews)) return res.status(400).json({error : "Please enter the reviews as an array."});

  for(let value of reviews) {
    if(isNaN(value)) return res.status(400).json({error : "At least one of the values in the reviews array is not a number."});
  }
  
  let {result, error} = await query(`SELECT COUNT(*) AS count FROM (SELECT * FROM playlistReview WHERE reviewID IN (?)) AS v;`, reviews);
  if(error !== undefined) return res.sendStatus(500);

  if(!result || !result[0] || result[0].count !== reviews.length) return res.status(400).json({error : "At least one of the review ids entered don't exist."});

  next();
}


function saveFile(path, doc) {
  fs.writeFile(path, JSON.stringify(doc), function writeJSON(err) {
    if(err) return console.log(err);
    console.log("saved " + path);
  });
}
async function getMainAdminID(req, res, next) {
  let {result, error} = await query(`SELECT id FROM user WHERE userName='administrator';`);
  if(error !== undefined) console.log(error);
  if(!(result && result[0] && result[0].id)) return res.send(500).json({error : "There currently is no main administrator account."});

  req.adminID = result[0].id;
  next();
}


exports.addAdminRoutes = addAdminRoutes;