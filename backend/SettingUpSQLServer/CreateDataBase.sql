CREATE DATABASE Music_Data;
USE Music_Data;

CREATE TABLE artist (
id INT NOT NULL AUTO_INCREMENT,
activeYearStart INT,
activeYearEnd INT,
contact VARCHAR(300),
dateCreated DATETIME(2),
handle VARCHAR(300),
location VARCHAR(500),
artistName VARCHAR(300),
relatedProjects VARCHAR(1500),
PRIMARY KEY (id)
);


CREATE TABLE artistMembers (
id INT NOT NULL AUTO_INCREMENT,
artistID INT NOT NULL,
member VARCHAR(606) NOT NULL,
PRIMARY KEY (id),
FOREIGN KEY (artistID) REFERENCES artist(id) ON UPDATE CASCADE);

CREATE TABLE artistTags (
id INT NOT NULL AUTO_INCREMENT,
artistID INT NOT NULL,
tag VARCHAR(300),
FOREIGN KEY (artistID) REFERENCES artist(id) ON UPDATE CASCADE,
PRIMARY KEY (id));

CREATE TABLE album (
id INT NOT NULL AUTO_INCREMENT,
dateCreated DATETIME(2),
dateReleased DATE,
handle VARCHAR(300),
producer VARCHAR(300),
title VARCHAR(300),
numTracks INT,
type VARCHAR(300),
artistName VARCHAR(300),
PRIMARY KEY(id));

CREATE TABLE albumTags (
id INT NOT NULL AUTO_INCREMENT,
albumID INT NOT NULL,
tag VARCHAR(300),
PRIMARY KEY(id),
FOREIGN KEY (albumID) REFERENCES album(id) ON UPDATE CASCADE);

CREATE TABLE genre(
id INT NOT NULL,
numTracks INT,
parentID INT,
title VARCHAR(100),
topLevelID INT,
PRIMARY KEY (id));

CREATE TABLE track (
id INT NOT NULL AUTO_INCREMENT,
albumID INT NULL, 
artistID INT NOT NULL,
licenseTitle VARCHAR(300),
bitRate INT,
composer VARCHAR(300),
copyrightC VARCHAR(300),
copyrightP VARCHAR(300),
dateCreated DATETIME(2),
dateRecorded DATE,
discNumber INT,
duration TIME,
explicit VARCHAR(50),
languageCode VARCHAR(10),
number INT,
publisher VARCHAR(100),
title VARCHAR(300),
PRIMARY KEY (id));

ALTER TABLE track ADD COLUMN artistName VARCHAR(300);
ALTER TABLE track ADD COLUMN albumName VARCHAR(300);

CREATE TABLE trackGenres (
trackID INT NOT NULL,
genreID INT NOT NULL,
PRIMARY KEY (trackID, genreID),
FOREIGN KEY (trackID) REFERENCES track(id) ON UPDATE CASCADE);

CREATE TABLE trackTags (
id INT NOT NULL AUTO_INCREMENT,
trackID INT NOT NULL,
tag VARCHAR(300) NOT NULL,
PRIMARY KEY(id),
FOREIGN KEY (trackID) REFERENCES track(id) ON UPDATE CASCADE);

CREATE TABLE user (
id INT NOT NULL AUTO_INCREMENT,
verifiedEmail BOOLEAN NOT NULL,
disabled BOOLEAN NOT NULL,
email VARCHAR(320) NOT NULL,
userName VARCHAR(100) NOT NULL,
password VARCHAR(60) NOT NULL,
PRIMARY KEY (id));
ALTER TABLE user MODIFY COLUMN email VARCHAR(320) NOT NULL UNIQUE;

CREATE TABLE playlist(
id INT NOT NULL AUTO_INCREMENT,
name VARCHAR(300) NOT NULL,
userID INT NOT NULL,
dateLastChanged DATETIME(2) NOT NULL,
publicVisibility BOOLEAN NOT NULL,
description VARCHAR(1000),
PRIMARY KEY (id),
FOREIGN KEY (userID) REFERENCES user(id) ON UPDATE CASCADE);

CREATE TABLE playlistTrack(
playlistID INT NOT NULL AUTO_INCREMENT,
trackID INT NOT NULL,
PRIMARY KEY(playlistID, trackID),
FOREIGN KEY (playlistID) REFERENCES playlist(id) ON UPDATE CASCADE,
FOREIGN KEY (trackID) REFERENCES track(id) ON UPDATE CASCADE);

CREATE TABLE playlistReview(
reviewID INT NOT NULL AUTO_INCREMENT,
rating INT NOT NULL,
review VARCHAR(1000),
userID INT NOT NULL,
playlistID INT NOT NULL,
PRIMARY KEY(reviewID),
FOREIGN KEY (playlistID) REFERENCES playlist(id) ON UPDATE CASCADE,
FOREIGN KEY (userID) REFERENCES user(id) ON UPDATE CASCADE);

CREATE TABLE expiredRefreshJWT(
jti VARCHAR(32) NOT NULL,
PRIMARY KEY(jti));
ALTER TABLE expiredRefreshJWT RENAME expiredJWT;