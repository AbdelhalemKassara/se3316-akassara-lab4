const mysql = require('mysql2');
const credentials = require('./serverCredentials.json');

let con = mysql.createConnection(credentials);


//check if I will need to deal with the catch statement at the end in the rest of the code
export async function query(sqlCommand, data) {
  let params = [sqlCommand];
  if(data !== undefined) params.push([data]);

  return await new Promise((resolve, reject) => {
    con.query(...params, function(err, result) {
      if(err) return reject(err);
      resolve(result);
    });
  }).catch(e => console.log(e));
}

//connecting to database and starting server
export function startDatabaseConnection() {
  return new Promise ((resolve, reject) => {
    con.connect(async function(err) {
    if(err) reject(err);
    console.log("SQL Database Connected");
    resolve();
    })
  }).catch((err) => {
    console.log(err);
  });
}

