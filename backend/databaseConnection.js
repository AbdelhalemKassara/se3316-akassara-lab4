const mysql = require('mysql2');
const credentials = require('./serverCredentials.json');
const moment = require('moment');
let con = mysql.createConnection(credentials);


//returns either an error object or an result object
async function query(sqlCommand, data, ) {
  let params = [sqlCommand];
  if(data !== undefined) params.push([data]);

  return await new Promise((resolve, reject) => {
    con.query(...params, function(err, result) {
      if(err) return reject(err);
      resolve({result : result});
    });
  }).catch(e => {
    return {error : e};
  });
}

//connecting to database and starting server
function startDatabaseConnection() {
  return new Promise ((resolve, reject) => {
    con.connect(async function(err) {
    if(err) reject(err);
    console.log("SQL Database Connected");
    resolve();
    })
  }).catch((err) => {
    console.log(err);
    return err;
  });
}
function UTCtoSQLDate(val) {
  return moment(new Date(0).setUTCSeconds(val)).format('YYYY-MM-DD HH:mm:ss');
}

function CurSQLDate() {
  return moment().format('YYYY-MM-DD HH:mm:ss');
}

exports.UTCtoSQLDate = UTCtoSQLDate;
exports.query = query;
exports.startDatabaseConnection = startDatabaseConnection;
exports.CurSQLDate = CurSQLDate;