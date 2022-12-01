#stuff to change on server database
ALTER TABLE expiredRefreshJWT RENAME expiredJWT;

ALTER TABLE user MODIFY COLUMN email VARCHAR(320) NOT NULL UNIQUE;

ALTER TABLE playlist ADD CONSTRAINT unique_playlistName_With_userID UNIQUE (userID, name);

ALTER TABLE user ADD COLUMN admin BOOLEAN DEFAULT 0;

##make the email in the user table unqiue
SELECT * FROM user;

DELETE FROM user;

DELETE FROM Playlist WHERE name='playlist3';

SELECT * FROM playlist;
SELECT id FROM track;

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
