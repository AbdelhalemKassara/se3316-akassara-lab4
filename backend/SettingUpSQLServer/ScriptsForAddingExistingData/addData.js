const mysql = require('mysql2');
const credentials = require('../../serverCredentials.json');

let con = mysql.createConnection(credentials);

con.connect(async function(err) {
  if(err) throw err;
  console.log("SQL Database Connected");
  await addGenres();
  await query("SELECT * FROM genre;");
  endConnection();
});

//added
async function addGenres() {
  const genres = require('../DatabaseData/genres.json');

  const values = genres.map( val => Object.values(val));
  const queryString = 'INSERT INTO genre (id, numTracks, parentID, title, topLevelID) VALUES ?';
  
  return await query(queryString, values);
}


function addAlbums() {
  const albums = require('../DatabaseData/albums.json');
  const values = albums.map( val => Object.values(val));

  const queryString = "INSERT INTO album (id, dateCreated, dateReleased, handle, producer, title, numTracks, type, artistName) VALUES ?";
  console.log(query(queryString, values));
  endConnection();
}

function endConnection() {
  con.end(function (err) {
    if(err) throw err;
    console.log("SQL Database Disconnected");
  });
}

async function query(sqlCommand, data) {
  let params = [sqlCommand];
  if(data !== undefined) params.push([data]);

  return await new Promise((resolve, reject) => {
    con.query(...params, function(err, result) {
      if(err) return reject(err.message);
      console.log(result);
      resolve(result);
    });
  }).catch(e => console.log(e));
}

function generateSQL(element, tableName) {
  let sql = "INSERT INTO " + tableName + " (" + formatData(Object.keys(element)) + ") VALUES ?";

  return sql;
  function formatData(vals) {
      let str = "";
      vals.forEach((val) => {
          str += '' + val + ', ';
      });

      return str.slice(0, str.length-2);
  }
}