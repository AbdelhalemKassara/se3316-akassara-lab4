const mysql = require('mysql2');
const credentials = require('../../serverCredentials.json');

let con = mysql.createConnection(credentials);

con.connect(async function(err) {
  if(err) throw err;
  console.log("SQL Database Connected");
  //await addGenres();
  //await query("SELECT * FROM genre;");
  //await addAlbums();
  // await addAlbumTags();
  // await addArtist();
  // await addArtistMembers();
  // await addArtistTags();  
  //  await addTracks();
  // await addTrackGenres();
  // await addTrackGenres();
  // await addTrackTags();
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
    return [
    val["album_id"], convertDate(val["album_date_created"]),
    convertDate(val["album_date_released"]), val["album_handle"],
    val["album_producer"], val["album_title"],
    val["album_tracks"], val["album_type"],
    val["artist_name"]
  ].map(val => ifValEmpty(val));//if the value is an empty string return null;
  });

  console.log(values);

  const queryString = "INSERT INTO album (id, dateCreated, dateReleased, handle, producer, title, numTracks, type, artistName) VALUES ?";
  return await query(queryString, values);
}
async function addAlbumTags() {
  const albums = require('../DatabaseData/albums.json');
  const values = [];

  albums.forEach( val => {
    eval(val["tags"]).forEach(tag => {
      values.push([val["album_id"], tag]);
    });
  });


  const queryString = "INSERT INTO albumTags (albumID, tag) VALUES ?";
  return await query(queryString, values);
}

async function addArtist() {
  const artists = require('../DatabaseData/artists.json');
  let values = artists.map(val => {
    return [val["artist_id"], convertNumber(val["artist_active_year_begin"]),
    convertNumber(val["artist_active_year_end"]), val["artist_contact"],
    convertDate(val["artist_date_created"]), val["artist_handle"],
    val["artist_location"], val["artist_name"], val["artist_related_projects"]
    ].map(val => ifValEmpty(val));//if the value is an empty string return null;
  });
  console.log(values);
  const queryString = "INSERT INTO artist (id, activeYearStart, activeYearEnd, contact, dateCreated, handle, location, artistName, relatedProjects) VALUES ?";

  return await query(queryString, values);
}

async function addArtistMembers() {
  const artists = require('../DatabaseData/artists.json');
  let values = [];
  artists.forEach(val => {
      val["artist_members"].split('\n').forEach(member => {
        if(member != '') {
          values.push([val["artist_id"], member]);
        }
      });
  });
  
  const queryString = "INSERT INTO artistMembers (artistID, member) VALUES ?";
  return await query(queryString, values);  
}

async function addArtistTags() {
  const artist = require('../DatabaseData/artists.json');
  const values = [];

  artist.forEach( val => {
    eval(val["tags"]).forEach(tag => {
      values.push([val["artist_id"], tag]);
    });
  });

  const queryString = "INSERT INTO artistTags (artistID, tag) VALUES ?";
 return await query(queryString, values);
}


async function addTracks() {
  const tracks = require('../DatabaseData/tracks.json');

  let values = tracks.map(val => {
     return [val["track_id"], val["album_id"], val["artist_id"],
    val["license_title"], val["track_bit_rate"], val["track_composer"],
    val["track_copyright_c"], val["track_copyright_p"], convertDate(val["track_date_created"]),
    convertDate(val["track_date_recorded"]), val["track_disc_number"], convertTime(val["track_duration"]), 
    val["track_explicit"], val["track_language_code"], val["track_number"], val["track_publisher"],
    val["track_title"]
    ].map(val => ifValEmpty(val));//if the value is an empty string return null;
  });

  //console.log(values);
const queryString = "INSERT INTO track (id, albumID, artistID, licenseTitle, bitRate, composer, copyrightC, copyrightP, dateCreated, dateRecorded, discNumber, duration, explicit, languageCode, number, publisher, title) VALUES ?";  
  return await query(queryString, values);
}

function checkTracksArtistExists() {
  const tracks = require('../DatabaseData/tracks.json');
  const artists = require('../DatabaseData/artists.json');
  tracks.forEach(track => {
    if(track["artist_id"] != '') {
      let exists = false;

      for(let i = 0; i < artists.length; i++) {
        if(artists[i]["artist_id"] == track['artist_id']) {
          exists = true;
          break;
        }
      }
      
      if(!exists) {
        console.log(track["track_id"], " ", track["artist_id"]);
      }
    }
  })
  
}
function checkTracksAlbumExists() {
  const albums = require('../DatabaseData/albums.json');
  const tracks = require('../DatabaseData/tracks.json');

  tracks.forEach(track => {
    if(track["album_id"] != '') {
      let exists = false;

      for(let i = 0; i < albums.length; i++) {
        if(albums[i]["album_id"] == track['album_id']) {
          exists = true;
          break;
        }
      }
      
      if(!exists) {
        console.log(track["track_id"], " ", track["album_id"]);
      }
    }
  })
}

async function addTrackGenres() {
  const tracks = require('../DatabaseData/tracks.json');
  let values = [];
  tracks.forEach(track => {
    let genres = eval(track["track_genres"]);
    let check = new Map();

    if(genres != undefined) {
      genres.forEach(genre => {
        if(genre["genre_id"] == '806'){
          if(!check.has('21')) {
            values.push([track["track_id"], '21']);//806 is the same genre as 21 but doesn't exist in our genres table
          } 
        } else {
          check.set(genre["genre_id"], "");
          values.push([track["track_id"], genre["genre_id"]]);
        }
      })
    }
  })

  const queryString = "INSERT INTO trackGenres (trackID, genreID) VALUES ?";  

  return await query(queryString, values);
}


function checkTracksGenresExists() {
  const tracks = require('../DatabaseData/tracks.json');
  const genres = require('../DatabaseData/genres.json');
  //if genre_id = 806 set it to 21
  tracks.forEach(track => {
    let out = eval(track["track_genres"])
    if(out != undefined) {
      out.forEach(val => {
        let exists = false;
        
        for(let i = 0; i < genres.length; i++) {
          if(genres[i]["genre_id"] == val["genre_id"]) {
            exists = true;
            break;
          }
        }
        if(!exists) {
          console.log(val);
        }
  
      });
    }
  });
}

async function addTrackTags() {
  const tracks = require('../DatabaseData/tracks.json');
  let values = [];

  tracks.forEach(track => {
    eval(track["tags"]).forEach(tag => {
      values.push([track["track_id"], tag]);
    });
  });

  let queryString = "INSERT INTO trackTags (trackID, tag) VALUES ?"

  return await query(queryString, values);
}





function convertTime(str) {
  if(str == '' || str.length >= 8) return str;

  return "00:" + str;
}
function convertNumber(str) {
  return str == ''? str : Number(str);
}
function convertDate(str) {
  if(str == '') {
    return str;
  }

  let output;

  let arr = str.split(/\s|:|\//);//split if there is a space, /, or :
  if(arr.length === 3) {
    output = `${arr[2]}-${padZeros(arr[0],2)}-${padZeros(arr[1],2)}`;//reformat the data to sql specifications
  } else {
    arr = arr.map((val, i) => i === arr.length-1? val : Number(val));//convert values to number
    arr[3] = arr[arr.length-1] == 'PM' && arr[3] != 12? arr[3] + 12 : arr[3];//convert pm to 24h
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
      if(err) {
        console.log(err);
        return reject(err.message);
      }
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