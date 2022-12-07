const { query } = require('./databaseConnection');
const AcceptableUsePolicy = require('./Documents/AcceptableUsePolicy.json');
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

   admin.get('/documents/acceptableusepolicy', (req, res) => {
    res.json(AcceptableUsePolicy);
   })
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