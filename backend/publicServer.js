const {query, startDatabaseConnection, UTCtoSQLDate, CurSQLDate} = require('./databaseConnection');
const aboutMessage = require('./aboutMessage.json');
const stringSimilarity = require('string-similarity');
const mysql = require('mysql2');
const AcceptableUsePolicy = require('./Documents/AcceptableUsePolicy.json');
const DMCAPolicy = require('./Documents/DMCAPolicy.json');
const SecurityAndPrivacyPolicy = require('./Documents/securityAndPrivacyPolicy.json');

function addPublicRoutes(playlists, search, router) {
    //*Get (retrieve)
  router.get('/genres',(req, res) => {
  });
  //sends information about all the playlists
  router.get('/playlists', async (req, res) => {
    //this returns null for playlist id that don't have an tracks
    //this thing returns all the public playlist and gets their duration and number of tracks and gets the 10 most recently changed playlists
    let publicPlaylists = await query(`SELECT id AS playlistID, userName, name, dateLastChanged, publicVisibility, description, numOfTracks, duration, averageRating FROM 
    (SELECT res.id, userName, name, dateLastChanged, publicVisibility, description, numOfTracks, duration 
    FROM user JOIN (
    SELECT * 
    FROM playlist LEFT JOIN (
    SELECT COUNT(*) AS numOfTracks, SEC_TO_TIME(SUM(time_to_sec(duration))) AS duration, p.playlistID  
    FROM playlistTrack AS p 
    JOIN track AS t ON t.id = p.trackID GROUP BY p.playlistID) AS a ON a.playlistID = playlist.id 
    WHERE playlist.publicVisibility=1) AS res on res.userID = user.id ORDER BY dateLastChanged DESC LIMIT 10) AS list
    LEFT JOIN (SELECT playlistID, AVG(rating) AS averageRating FROM playlistReview GROUP BY playlistID) AS ratings ON ratings.playlistID=list.id;
    `);

    if(publicPlaylists.error !== undefined) return res.status(500).send();

    res.json(publicPlaylists.result);
  });
  
  router.get('/about', (req, res) => {
    return res.json(aboutMessage);
  });

  //given a track id it will return a track or error message
  router.get('/tracks/:playlistId', async (req, res) => {
    let id = req.params.playlistId;
    if(isNaN(id)) return res.status(400).json({error : "Please enter a number"});
    

    let result = await query(`SELECT publicVisibility FROM playlist WHERE id=${id};`);
    if(result.error !== undefined) return res.sendStatus(500);
    if(result.result.length == 0) return res.stauts(400).send({error : "This playlist doesn't exist."});
    if(result.result[0].publicVisibility === 0) return res.status(403).send({error : "This playlist is private."});

    let tracks = await query('SELECT track.* FROM (SELECT * FROM playlistTrack WHERE playlistID='+ id + ') AS pTracks JOIN track WHERE pTracks.trackID = track.id;');
    if(tracks.error !== undefined) return res.sendStatus(500);

    return res.json(tracks.result);
  });
  
  //given a track id it will return the track or an error message
  router.get('/track/:id', async (req, res) => {
    let id = req.params.id;
    if(isNaN(id)) return res.status(400).json({error : "Please enter a number"});

    let track = await query('SELECT * FROM track WHERE id=' + id);
    if(track.error !== undefined) return res.sendStatus(500);

    if(track.result.length === 0) return res.status(404).json({error : "This track id doesn't exist"});
    
    return res.json(track.result[0]);
    
  });
  
  router.get('/search', verifySearchInput, async (req, res) => {
    let searchTerms = req.query;

    let ratedTracks;
    let ratedArtists;
    let ratedGenres;
    if(searchTerms.track.length > 1 && /\S/.test(searchTerms.track)) {//check if there are characters other than white space
      let trackTitles = await query("SELECT DISTINCT title AS trackTitle FROM track;");
      if(trackTitles.error !== undefined) return res.sendStatus(500);

      ratedTracks = stringSimilarity.findBestMatch(searchTerms.track, trackTitles.result.map(val => val.trackTitle));
    }

    if(searchTerms.artist.length > 1 && /\S/.test(searchTerms.artist)) {
      let artistNames = await query("SELECT DISTINCT artistName FROM track;");
      if(artistNames.error !== undefined) return res.sendStatus(500);

      ratedArtists = stringSimilarity.findBestMatch(searchTerms.artist, artistNames.result.map(val => val.artistName))
    }

    if(searchTerms.genre.length > 1 && /\S/.test(searchTerms.genre)) {
      let genres = await query("SELECT DISTINCT title AS genre FROM genre;");
      if(genres.error !== undefined) return res.sendStatus(500);
      
      ratedGenres = stringSimilarity.findBestMatch(searchTerms.genre, genres.result.map(val => val.genre))
    }

    let ratedGenresStr = "";
    let ratedArtistsStr = "";
    let ratedTracksStr = "";
    //combine the results(add tags to identify where they came from) then sort
    if(ratedTracks !== undefined) {ratedTracksStr = formatArrStr(ratedTracks.ratings.sort(sortRated), 0.25);}
    if(ratedArtists !== undefined) {ratedArtistsStr = formatArrStr(ratedArtists.ratings.sort(sortRated), 0.25);}
    if(ratedGenres !== undefined) {ratedGenresStr = formatArrStr(ratedGenres.ratings.sort(sortRated), 0.25);}//(sortedRate).slice(0, 10)
   
    let result = {};
    if(searchTerms.artist === "" && searchTerms.track === "" && searchTerms.genre === "") {
      result = await query("SELECT * FROM track LIMIT 100;");
    }  else {
      result = await query(formQueryStr(ratedArtistsStr, ratedTracksStr, ratedGenresStr, searchTerms.artist, searchTerms.track, searchTerms.genre));
    }
    if(result.error !== undefined) return res.sendStatus(500);

    //there are multiple rows in the result.result object that are the same except for the genre, this combines them
    let out = new Map();
    result.result.forEach(val => {
      if(out.has(val.id)) {
        out.get(val.id).genre.push(val.genre);

      } else {
        out.set(val.id, {...val, genre : [val.genre]});
      }
    })
    return res.status(200).json(Array.from(out.values()));

    //functions
    function sortRated(a, b) {//note this function is an invalid sort method. I changed it as sort only sorts by least to greatest and I prefer the reverse
      if(a.rating < b.rating) return 1;
      if(a.rating > b.rating) return -1;
      
      return 0;
    }
    function formQueryStr(artists, tracks, genres, slAartists, slTracks, slGenres) {
      let queryStr = `SELECT t.id, t.albumID, t.artistID, t.licenseTitle, t.bitRate, t.composer, t.copyrightC, t.copyrightP, t.dateCreated, 
      t.dateRecorded, t.discNumber, t.duration, t.number, t.publisher, t.title, t.artistName, t.albumName, genre.title AS genre 
      FROM (SELECT track.*, trackGenres.genreID FROM track JOIN trackGenres ON track.id=trackGenres.trackID) AS t JOIN genre ON genre.id =t.genreID
      WHERE`;

      //add terms that closely match
      queryStr += artists !== "" ? " t.artistName IN " + artists : artists;

      queryStr += queryStr.charAt(queryStr.length-1) === ')' && tracks !== "" ? " AND" : "";
      queryStr += tracks !== "" ? " t.title IN " + tracks : tracks;

      queryStr += queryStr.charAt(queryStr.length-1) === ')' && genres !== "" ? " AND" : "";
      queryStr += genres !== "" ? " genre.title IN " + genres : genres;

      //add single letters
      if(slAartists !== undefined && slAartists.length === 1) {
        queryStr += queryStr.charAt(queryStr.length-1) === ')' && slAartists !== "" ? " AND" : "";
        queryStr += slAartists !== "" ? ` t.artistName LIKE '${slAartists}%'` : slAartists;  
      }
      if(slTracks !== undefined && slTracks.length === 1) {
        console.log(queryStr.charAt(queryStr.length-1));
        queryStr += (queryStr.charAt(queryStr.length-1) === ')' || queryStr.charAt(queryStr.length-1) === "'") && slTracks !== "" ? " AND" : "";
        queryStr += slTracks !== "" ? ` t.title LIKE '${slTracks}%'` : slTracks;  
      }
      if(slGenres !== undefined && slGenres.length === 1) {
        queryStr += (queryStr.charAt(queryStr.length-1) === ')' || queryStr.charAt(queryStr.length-1) === "'") && slGenres !== "" ? " AND" : "";
        queryStr += slGenres !== "" ? ` t.title LIKE '${slGenres}%'` : slGenres;  
      }


      //add sorting
      if(artists !== '' || tracks !== '' || genres !== '') {
        queryStr += " ORDER BY ";
        queryStr += tracks !== "" ? " field(t.title, " + tracks.slice(1, tracks.length) + ", " : "";
        queryStr += artists !== "" ? " field(t.artistName, " + artists.slice(1, artists.length) + ", " : "";
        queryStr += genres !== "" ? " field(genre.title, " + genres.slice(1, genres.length) + ", " : "";
  
        queryStr = queryStr.slice(0, queryStr.length-2);//remove last comma
      }
     

      queryStr += " LIMIT 100;";
      return queryStr;
    }
    function formatArrStr(arr, minRating) {
      let str = '(';
      arr.forEach((val) => {
        if(val.rating > minRating) {
          str += "" + mysql.escape(String(val.target)) + ", ";
        }
      })

      if(str.slice(1, str.length) !== "") {
        str = str.slice(0, str.length-2);
        str += ')'
        return str;
      } else {
        return "";
      }
    }  
  });

  router.get('/playlist/reviews/:id', async (req,res) => {
    let id = req.params.id;
    if(isNaN(id)) return res.status(400).send({error : "Please enter a number as playlist id"});
    
    //check if the playlist is public
    let result = await query("SELECT publicVisibility FROM playlist WHERE id="+ id + ';');
    if(result.error !== undefined) return res.sendStatus(500);
    if(result.result.length == 0) return res.status(404).json({error : "This playlist doesn't exist."});
    if(result.result[0].publicVisibility == 0) return res.status(403).json({error : "This playlist is private."});

    result = await query("SELECT playlistReview.*, user.userName FROM playlistReview JOIN user ON user.id=playlistReview.userID WHERE playlistID=" + id + " AND playlistReview.disabled=0;");
    if(result.error !== undefined) return res.sendStatus(500);
    
    return res.status(200).json(result.result);
  })

  router.get('/documents/acceptableusepolicy', (req, res) => {
    res.json(AcceptableUsePolicy);
  });
  router.get('/documents/dmcapolicy', (req, res) => {
    res.json(DMCAPolicy);
  });

  router.get('/documents/securityandprivacypolicy', (req, res) => {
    res.json(SecurityAndPrivacyPolicy);
  })
}

function verifySearchInput(req, res, next) {
  let searchTerms = req.query;

  if(searchTerms === undefined || searchTerms === null) return res.status(400).json({error : "Please enter artist, track, and genre values"});

  if(searchTerms.artist === undefined) return res.status(400).json({error : "Please enter a value or empty string for artist."});
  if(searchTerms.track === undefined) return res.status(400).json({error : "Please enter a value or empty string for track."});
  if(searchTerms.genre === undefined) return res.status(400).json({error : "Please enter a value or empty string for genre."});

  if(typeof searchTerms.artist !== 'string' && !(searchTerms.artist instanceof String)) return res.status(400).json({error : "please enter a string for the artist field."});
  if(typeof searchTerms.track !== 'string' && !(searchTerms.track instanceof String)) return res.status(400).json({error : "please enter a string for the track field."});
  if(typeof searchTerms.genre !== 'string' && !(searchTerms.genre instanceof String)) return res.status(400).json({error : "please enter a string for the genre field."});

  // if((searchTerms.artist === "" || /\S/.test(searchTerms.artist)) && (searchTerms.track === "" || /\S/.test(searchTerms.track)) && (searchTerms.genre === "" || /\S/.test(searchTerms.genre))) {
  //   return res.status(400).json({error : "Please enter a value for at least one of the parameters."})
  // }
  next();
}

exports.addPublicRoutes = addPublicRoutes;