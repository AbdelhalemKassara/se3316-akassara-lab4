const mysql = require('mysql2');
const credentials = require('../../serverCredentials.json');

let con = mysql.createConnection(credentials);

con.connect(async function(err) {
  if(err) throw err;
  console.log("SQL Database Connected");
  //await addGenres();
  //await query("SELECT * FROM genre;");
  await addAlbums();

  endConnection();
});

//added
async function addGenres() {
  const genres = require('../DatabaseData/genres.json');

  const values = genres.map( val => Object.values(val));
  const queryString = 'INSERT INTO genre (id, numTracks, parentID, title, topLevelID) VALUES ?';
  
  return await query(queryString, values);
}


async function addAlbums() {
  const albums = require('../DatabaseData/albums.json');
  const values = albums.map( val => {
    let dateCreatedStr = val["album_date_created"];
    let arr = dateCreatedStr.split(/\s|:|\//);//split if there is a space, /, or :
    
    arr = arr.map((val, i) => i === arr.length-1? val : Number(val));//convert values to number
    arr[3] = arr[arr.length-1] == 'PM'? arr[3] + 12 : arr[3];//convert pm to 24h
    arr[3] = arr[arr.length-1] == 'AM' && arr[3] == 12? 0 : arr[3];//convert 12am to 0
    arr = arr.map((val) => String(val));//convert back to a string

    dateCreatedStr = `${arr[2]}-${padZeros(arr[0],2)}-${padZeros(arr[1],2)} ${padZeros(arr[3],2)}:${padZeros(arr[4],2)}:${padZeros(arr[5],2)}`;//reformats the date to sql specifications

    let output = [val["album_id"], dateCreatedStr,
    val["album_date_released"], val["album_handle"],
    val["album_producer"], val["album_title"],
    val["album_tracks"], val["album_type"],
    val["artist_name"]];

    output = output.map(val => ifValEmpty(val));//if the value is an empty string return null

    return output;
  });
  console.log(values);

  const queryString = "INSERT INTO album (id, dateCreated, dateReleased, handle, producer, title, numTracks, type, artistName) VALUES ?";
  return await query(queryString, values);
}
function convertDate(str) {
  let output;
  let arr = str.split(/\s|:|\//);//split if there is a space, /, or :
  if(arr.length === 3) {
    output = `${arr[2]}-${padZeros(arr[0],2)}-${padZeros(arr[1],2)}`;//reformat the data to sql specifications
  } else {
    arr = arr.map((val, i) => i === arr.length-1? val : Number(val));//convert values to number
    arr[3] = arr[arr.length-1] == 'PM'? arr[3] + 12 : arr[3];//convert pm to 24h
    arr[3] = arr[arr.length-1] == 'AM' && arr[3] == 12? 0 : arr[3];//convert 12am to 0
    arr = arr.map((val) => String(val));//convert back to a string

    output = `${arr[2]}-${padZeros(arr[0],2)}-${padZeros(arr[1],2)} ${padZeros(arr[3],2)}:${padZeros(arr[4],2)}:${padZeros(arr[5],2)}`;//reformats the date to sql specifications
  }
  return output;
}
function ifValEmpty(val) {
  return val == ''? null : val;
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

function padZeros(val, length) {
  val = String(val);
  let out = val;

  for(let i = 0; i < (length - val.length); i++) {
      out = "0" + out;
  }
  
  return out;
}