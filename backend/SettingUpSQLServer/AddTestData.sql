#stuff to change on server database
ALTER TABLE expiredRefreshJWT RENAME expiredJWT;

ALTER TABLE user MODIFY COLUMN email VARCHAR(320) NOT NULL UNIQUE;

ALTER TABLE playlist ADD CONSTRAINT unique_playlistName_With_userID UNIQUE (userID, name);

ALTER TABLE user ADD COLUMN admin BOOLEAN DEFAULT 0;

##testing stuff
SELECT * FROM user;

UPDATE user SET disabled=1 WHERE id=68;

UPDATE playlist SET description='this is a description for playlist3 i think' WHERE id=7;
UPDATE playlist SET publicVisibility=1;
INSERT INTO playlistTrack (playlistID, trackID) VALUES (3, 30);


SELECT * FROM playlist WHERE publicVisibility=1 ORDER BY dateLastChanged ASC LIMIT 10;

SELECT * FROM playlistTrack AS p JOIN track AS t ON t.id = p.trackID WHERE p.playlistID = 3; 
SELECT * FROM playlist LEFT JOIN (SELECT COUNT(*) AS numOfTracks, SEC_TO_TIME(SUM(time_to_sec(duration))) AS duration, p.playlistID  FROM playlistTrack AS p JOIN track AS t ON t.id = p.trackID GROUP BY p.playlistID) AS a ON a.playlistID = playlist.id WHERE playlist.publicVisibility=1; 

SELECT * FROM user JOIN 
(SELECT * FROM playlist LEFT JOIN 
(SELECT COUNT(*) AS numOfTracks, SEC_TO_TIME(SUM(time_to_sec(duration))) AS duration, p.playlistID  FROM playlistTrack AS p JOIN track AS t ON t.id = p.trackID GROUP BY p.playlistID) AS a ON a.playlistID = playlist.id WHERE playlist.publicVisibility=1) AS res on res.userID = user.id; 

SELECT playlistID, userName, name, dateLastChanged, publicVisibility, description, numOfTracks, duration 
FROM user JOIN (
SELECT * FROM playlist LEFT JOIN (
SELECT COUNT(*) AS numOfTracks, SEC_TO_TIME(SUM(time_to_sec(duration))) AS duration, p.playlistID  
FROM playlistTrack AS p JOIN track AS t ON t.id = p.trackID GROUP BY p.playlistID) AS a ON a.playlistID = playlist.id 
WHERE playlist.publicVisibility=1) AS res on res.userID = user.id ORDER BY dateLastChanged DESC LIMIT 10; 


SELECT track.* FROM (SELECT * FROM playlistTrack WHERE playlistID=7) AS pTracks JOIN track WHERE pTracks.trackID = track.id;


SELECT id,title AS trackTitle FROM track;
SELECT id,artistName FROM track; #should be unique
SELECT id AS genreID, title AS genre FROM genre;#all values are unique

SELECT title, COUNT(*) AS c FROM genre GROUP BY title ORDER BY c DESC;
SELECT title, COUNT(*) AS c FROM track GROUP BY title ORDER BY c DESC;

SELECT DISTINCT artistName FROM track;

SELECT *  FROM track WHERE artistName 
IN ('Kurt Vile', 'Kurteek', 'Vurt', 'Gurtz','Kurt Baker' ) AND title IN ('Free', 'Freeway','Freeze', 'Free Me','Be Free' );

SELECT * FROM track WHERE artistName IN ('Kurt Vile') AND title IN ('Freeway', 'Space Forklift');

SELECT t.id, t.albumID, t.artistID, t.licenseTitle, t.bitRate, t.composer, t.copyrightC, t.copyrightP, t.dateCreated, t.dateRecorded, t.discNumber, t.duration, t.number, t.publisher, t.title, t.artistName, t.albumName, genre.title AS genre FROM (SELECT track.*, trackGenres.genreID FROM track JOIN trackGenres ON track.id=trackGenres.trackID) AS t JOIN genre ON genre.id =t.genreID WHERE t.id=20;

SELECT t.id, t.artistName, genre.title AS genre FROM (SELECT track.*, trackGenres.genreID FROM track JOIN trackGenres ON track.id=trackGenres.trackID) AS t JOIN genre ON genre.id =t.genreID;

SELECT title, artistName FROM track;
SELECT trackID FROM trackGenres JOIN genre on genre.id = trackGenres.genreID WHERE genre.id = 1;