const { query } = require('./databaseConnection');

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
  })
}

async function getMainAdminID(req, res, next) {
  let {result, error} = await query(`SELECT id FROM user WHERE userName='administrator';`);
  if(error !== undefined) console.log(error);
  if(!(result && result[0] && result[0].id)) return res.send(500).json({error : "There currently is no main administrator account."});

  req.adminID = result[0].id;
  next();
}


exports.addAdminRoutes = addAdminRoutes;