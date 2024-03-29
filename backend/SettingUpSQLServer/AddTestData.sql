#stuff to change on server database
ALTER TABLE expiredRefreshJWT RENAME expiredJWT;

ALTER TABLE user MODIFY COLUMN email VARCHAR(320) NOT NULL UNIQUE;

ALTER TABLE playlist ADD CONSTRAINT unique_playlistName_With_userID UNIQUE (userID, name);

ALTER TABLE user ADD COLUMN admin BOOLEAN DEFAULT 0;

ALTER TABLE playlistReview ADD COLUMN disabled BOOLEAN DEFAULT 0;


ALTER TABLE playlistReview ADD COLUMN creationDate DATETIME(2);
ALTER TABLE playlistReview MODIFY COLUMN creationDate DATETIME(2) NOT NULL;


##testing stuff


## testing/writing longer sql commands
SELECT reviewList.*, user.userName FROM (SELECT playlistReview.*, playlist.name FROM playlistReview JOIN playlist ON playlist.id=playlistReview.playlistID) AS reviewList JOIN user ON user.id=reviewList.userID;
SELECT reviewList.*, user.userName FROM 
        (SELECT playlistReview.*, playlist.name FROM playlistReview 
          JOIN playlist ON playlist.id=playlistReview.playlistID) AS reviewList 
          JOIN user ON user.id=reviewList.userID WHERE user.userName LIKE '%ratings%';
SELECT EXISTS (SELECT * FROM playlistTrack WHERE playlistID=14) AS 'exists';
SELECT * FROM track;
INSERT INTO playlistTrack (playlistID, trackID) VALUES (10, 274);
SELECT * FROM playlist WHERE id=18;
SELECT Count(*) FROM playlistReview;
#users 69, 70, 71
#playlists 3,4,7,9
SELECT id, verifiedEmail, disabled, userName, admin FROM user;

INSERT INTO playlistReview (userID, playlistID, rating, review) VALUES (69, 9, 7, 'This is a review of user id 69 the playlist 9 and it isnot very good with the id 4 or something and by user with id 69. here is some extra text sad;lfjads;klksdf;ajfd;sdaffdasafds');

UPDATE playlistReview SET rating=8 WHERE reviewID=10;

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

SELECT t.id, t.albumID, t.artistID, t.licenseTitle, t.bitRate, t.composer, t.copyrightC, t.copyrightP, t.dateCreated, t.dateRecorded, t.discNumber, t.duration, t.number, t.publisher, t.title, t.artistName, t.albumName, genre.title AS genre FROM (SELECT track.*, trackGenres.genreID FROM track JOIN trackGenres ON track.id=trackGenres.trackID) AS t JOIN genre ON genre.id =t.genreID 
WHERE genre.title IN ('Lo-Fi') 
AND t.title IN ('Shot', 'hot', 'Ear Shot', 'Show', 'Shoot Me', 'Big Shot', 'Long Shot', 'Buck Shot', 'Shot Down', 'Shoes', 'Shorn', 'Shoal', 'Shore', 'Shout', 'thots', 'So hot', 'Hot Shower', 'Money Shot', 'Rough Shot', 'Shotglass', 'Shoggoths', 'hotel M', 'Shoot Hoops', 'Photon', 'Shots Fired', 'Show Me', 'Shot Me Down', 'Shootinhead', 'Penalty Shot', 'Show Off', 'Shobuka', 'Air Show', 'Chotana', 'Shock ya', 'Showers', 'earshot', 'hotiron', 'Should I', 'Toy Shop', 'The Show', 'Hot Shit', 'Loto Ball Show', 'Shoot You Down', 'Shot to la Parc', 'Shoot The Curl', 'Gun Shot Blues', 'Campari Shots', 'Shootin\' Lass', 'Shoot The Loop', 'Shooting Star', 'She\'s not home', 'Shout Out', 'She', 'Shot in the foot', 'Who', 'T.V. Show', 'New Shoes', 'azathoth', 'Shy', 'Oop Shoop', 'Snapshot', 'Red Shoes', 'Shortcut', 'Drug Show', 'One Shot at Life', 'Side Show', 'Shocktop', 'Shootin Blanks', 'Shoe shoe', 'hol', 'Schottis', 'Shooting Stars', '8mm Vodka Shots', 'Short one', 'Sh8', 'Shoegaze', 'Got', 'Mot', 'Hard Shoe', 'Showtime', 'Red Shore', 'Peep Show', 'Pho', 'Potholes', 'Gift Shop', 'Shove It!', 'tot', 'Shot In The Dark', 'Shoutout', 'Shoombatapoota', 'Shot in the Heart', 'I Shoot The Devil', 'Shot The Beehive', 'One Shot Charlie', 'Shot Through You', 'hotentots', 'choco taco', 'She A Robot', 'Shoreline', 'Quize Show', 'A Short One', 'Shock Love', 'Sweet Shop', 'Stop Short', 'Mt Fox Shop', 'Photogram', 'a long shot', 'At The Show', 'Old Photos', 'PCB Shores', 'mucho trap', 'Don\'t Talk, Shoot', 'Straight Shooter', 'Shoe-Tang Bottle', 'Whole Lotta', 'Jota', 'Who.', 'Glot', 'houp', 'Ceratothoa', 'Funk Shoppe', 'Short Windy', 'Plot', 'Thor', 'Slot', 'MotherShip', 'cotc', 'Shovellin\'', 'Talent Show', 'Ship', 'woho', 'Shell Shock', 'Vote', 'Root', 'Opho', 'Osho', 'Photon Bath', 'Moot', 'Shed', 'Baby Shower', 'baby photos', 'Shhh', 'Spot', 'Horror Show', 'Phonotaxis', 'Rots', 'Xotk', 'Inner Shout', 'Shaw', 'Snot', 'Little Show', 'Photograph', 'Echo', 'Wrong Shoes', 'not p', 'Grot', 'hont', 'Dots', 'Shogeki Eki', 'I Got', 'Moth', 'Burnt Shoes', 'Black Shoes', 'Goth', 'Don\'t Shoot My Back', 'Whoa', 'Shock Shock', 'Shorts Song', 'foot', 'Leaf Shower', 'On The Shore', 'All For Show', 'Not I', 'Show The Way', 'Stone Shore', 'Shoot for the Stars', 'Olho', 'Show It To Me', 'Coffee Shop', 'Photo Album', 'Shie', 'W. Short Leg', 'Rota', 'motel whore', 'Riot', 'I Shot All The Birds', 'Fever (Flu Shot Mix)', 'Shoot The Music Down', 'Shopping Bag', 'Little Shoes', 'Good \'ol Shoe', 'Emo Step Show', 'Reality Show', 'Photosphere', 'Photo Retzah', 'Another Ship', 'Golden Shoes', 'Show Me Where', 'The Dead Show', 'Phonotaxis 2', 'Parashootin', 'mumz not home', 'Shoes In Sofa', 'Protophonia', 'She\'s a Robot', 'She Got Fangs', 'Short & Sharp', 'Short & Sweet', 'Short Shrift', 'Shower Scene', 'Cement Shoes', 'Parade Shoes', 'Shoddy Haunt', 'Safety Shoes', 'Eat My Shorts', 'Closing Shop', 'A Short Leash', 'Maggot Shack', 'Yog-Sothoth', 'How You Shoot Someone', 'Zombie Mass Shooting', 'Shot At the Post Office', 'Late Late Show', 'Not No', 'Ghost', 'Shaka', 'Shame', 'Notes', 'Cake Shop Girl', 'Lotus', 'Motif', 'Jhoba', 'Riots', 'Shot With Half A Bullet', 'Kyoto', 'Phone', 'Motor', 'Shark', 'Motel', 'Who Me', 'Choke', 'Shostakovich', 'She Chose Chav', 'Horizon Shore', 'howls', 'Shine', 'Smoking Shoes', 'ghosn', 'Who\'s Got Mine', 'Shake', 'Show the World', 'Milho', 'Idaho', 'Not Me', 'Shift', 'lotek', 'Motes', 'Distant Shore', 'Medicine Show', 'Sheep', 'chola', 'I Shouldn´t Go', 'Shovel Dancer', 'We Are Shocked', 'Shane', 'Elephant Shoe', 'Ethos', 'Shopska Suite', 'Shirt', 'Boots', 'Shock Machine', 'house', 'Pops Soda Shop', 'Euphotic Zone', 'Shiva', 'April Showers', 'Shopping mall', 'Share', 'Tenho', 'Show Sweet You', 'Notch', 'Falling Short', 'Shock and Gnaw', 'homie', 'Vinho', 'Chona', 'Tycho', 'Shade', 'RePot', 'Aviation Show', 'Spots', 'So Shy', 'Chops', 'lotos', 'Shochu Dreams', 'The Torgo Show', 'Killing Shoes', 'Shoulder Gold', 'Shame / School Shooter', 'Pilot', 'Show Yourself', 'Ships', 'Totem', 'Robot', 'Motic', 'Sha Na', 'Rooted Shrine', 'The Great Show', 'Two Maps And A Live Shot', 'hondo', 'Život', 'Whole', '60\'s Quiz Show', 'kotou', 'Times Be Short', 'rotor', 'hope!', 'WhoShall I Lah', 'Shock Therapy', 'Eliot', 'Booth', 'Rota 1', 'Rota 2', 'Rota 3', 'Moths', 'Noted', 'Ticho a samota', 'hithathuthot', 'Knots', 'Shhhh', 'Floot', 'For Who to Fail', 'Got Me', 'Take Off and Shoot a Zero', 'Makes Me Wanna Shoot You', 'Late Night Show', 'Ghost & Shadows', 'Shock Collared', 'Phone Booth Man', 'The Show Is Over', 'Feminist Short', 'Short Tempered', 'Shorter Piece 2', 'My Shoe Fell Off', 'Shopping Music', 'Different shot', 'Shortloopplay', 'Mother\'s Shawl', 'Summer Showers', 'hotfukdetekta', 'Not Your Choice', 'Gunshot Orgazm', 'Brogez/Sholem', 'Shark on the Lot', 'Vitamin Shoppe', 'Shock Corridor', 'Dancing Photon', 'Shower Request', 'The Photograph', 'Bare Shoulders', 'Showers of Pain', 'Khobe Schkotch', 'Head Of The Shop', 'Do Not Talk Shit', 'Meteors Shower', 'Distant Shores', 'Walk In My Shoes', 'Shower of Fruit', 'Nashotah Falls', 'Kyoketsu Shoge', 'Upon Our Shores', 'Imhotep\'s Tomb', 'Shopping - 2014', 'Drottningholm', 'Haunted Shores', 'Slow Short Acid', 'Aim Shoot Bang Fire March', 'Legal (Ganja Shot remix)')
AND t.artistName IN ('Glass Boy')
ORDER BY       
field(t.title, 'Shot', 'hot', 'Ear Shot', 'Show', 'Shoot Me', 'Big Shot', 'Long Shot', 'Buck Shot', 'Shot Down', 'Shoes', 'Shorn', 'Shoal', 'Shore', 'Shout', 'thots', 'So hot', 'Hot Shower', 'Money Shot', 'Rough Shot', 'Shotglass', 'Shoggoths', 'hotel M', 'Shoot Hoops', 'Photon', 'Shots Fired', 'Show Me', 'Shot Me Down', 'Shootinhead', 'Penalty Shot', 'Show Off', 'Shobuka', 'Air Show', 'Chotana', 'Shock ya', 'Showers', 'earshot', 'hotiron', 'Should I', 'Toy Shop', 'The Show', 'Hot Shit', 'Loto Ball Show', 'Shoot You Down', 'Shot to la Parc', 'Shoot The Curl', 'Gun Shot Blues', 'Campari Shots', 'Shootin\' Lass', 'Shoot The Loop', 'Shooting Star', 'She\'s not home', 'Shout Out', 'She', 'Shot in the foot', 'Who', 'T.V. Show', 'New Shoes', 'azathoth', 'Shy', 'Oop Shoop', 'Snapshot', 'Red Shoes', 'Shortcut', 'Drug Show', 'One Shot at Life', 'Side Show', 'Shocktop', 'Shootin Blanks', 'Shoe shoe', 'hol', 'Schottis', 'Shooting Stars', '8mm Vodka Shots', 'Short one', 'Sh8', 'Shoegaze', 'Got', 'Mot', 'Hard Shoe', 'Showtime', 'Red Shore', 'Peep Show', 'Pho', 'Potholes', 'Gift Shop', 'Shove It!', 'tot', 'Shot In The Dark', 'Shoutout', 'Shoombatapoota', 'Shot in the Heart', 'I Shoot The Devil', 'Shot The Beehive', 'One Shot Charlie', 'Shot Through You', 'hotentots', 'choco taco', 'She A Robot', 'Shoreline', 'Quize Show', 'A Short One', 'Shock Love', 'Sweet Shop', 'Stop Short', 'Mt Fox Shop', 'Photogram', 'a long shot', 'At The Show', 'Old Photos', 'PCB Shores', 'mucho trap', 'Don\'t Talk, Shoot', 'Straight Shooter', 'Shoe-Tang Bottle', 'Whole Lotta', 'Jota', 'Who.', 'Glot', 'houp', 'Ceratothoa', 'Funk Shoppe', 'Short Windy', 'Plot', 'Thor', 'Slot', 'MotherShip', 'cotc', 'Shovellin\'', 'Talent Show', 'Ship', 'woho', 'Shell Shock', 'Vote', 'Root', 'Opho', 'Osho', 'Photon Bath', 'Moot', 'Shed', 'Baby Shower', 'baby photos', 'Shhh', 'Spot', 'Horror Show', 'Phonotaxis', 'Rots', 'Xotk', 'Inner Shout', 'Shaw', 'Snot', 'Little Show', 'Photograph', 'Echo', 'Wrong Shoes', 'not p', 'Grot', 'hont', 'Dots', 'Shogeki Eki', 'I Got', 'Moth', 'Burnt Shoes', 'Black Shoes', 'Goth', 'Don\'t Shoot My Back', 'Whoa', 'Shock Shock', 'Shorts Song', 'foot', 'Leaf Shower', 'On The Shore', 'All For Show', 'Not I', 'Show The Way', 'Stone Shore', 'Shoot for the Stars', 'Olho', 'Show It To Me', 'Coffee Shop', 'Photo Album', 'Shie', 'W. Short Leg', 'Rota', 'motel whore', 'Riot', 'I Shot All The Birds', 'Fever (Flu Shot Mix)', 'Shoot The Music Down', 'Shopping Bag', 'Little Shoes', 'Good \'ol Shoe', 'Emo Step Show', 'Reality Show', 'Photosphere', 'Photo Retzah', 'Another Ship', 'Golden Shoes', 'Show Me Where', 'The Dead Show', 'Phonotaxis 2', 'Parashootin', 'mumz not home', 'Shoes In Sofa', 'Protophonia', 'She\'s a Robot', 'She Got Fangs', 'Short & Sharp', 'Short & Sweet', 'Short Shrift', 'Shower Scene', 'Cement Shoes', 'Parade Shoes', 'Shoddy Haunt', 'Safety Shoes', 'Eat My Shorts', 'Closing Shop', 'A Short Leash', 'Maggot Shack', 'Yog-Sothoth', 'How You Shoot Someone', 'Zombie Mass Shooting', 'Shot At the Post Office', 'Late Late Show', 'Not No', 'Ghost', 'Shaka', 'Shame', 'Notes', 'Cake Shop Girl', 'Lotus', 'Motif', 'Jhoba', 'Riots', 'Shot With Half A Bullet', 'Kyoto', 'Phone', 'Motor', 'Shark', 'Motel', 'Who Me', 'Choke', 'Shostakovich', 'She Chose Chav', 'Horizon Shore', 'howls', 'Shine', 'Smoking Shoes', 'ghosn', 'Who\'s Got Mine', 'Shake', 'Show the World', 'Milho', 'Idaho', 'Not Me', 'Shift', 'lotek', 'Motes', 'Distant Shore', 'Medicine Show', 'Sheep', 'chola', 'I Shouldn´t Go', 'Shovel Dancer', 'We Are Shocked', 'Shane', 'Elephant Shoe', 'Ethos', 'Shopska Suite', 'Shirt', 'Boots', 'Shock Machine', 'house', 'Pops Soda Shop', 'Euphotic Zone', 'Shiva', 'April Showers', 'Shopping mall', 'Share', 'Tenho', 'Show Sweet You', 'Notch', 'Falling Short', 'Shock and Gnaw', 'homie', 'Vinho', 'Chona', 'Tycho', 'Shade', 'RePot', 'Aviation Show', 'Spots', 'So Shy', 'Chops', 'lotos', 'Shochu Dreams', 'The Torgo Show', 'Killing Shoes', 'Shoulder Gold', 'Shame / School Shooter', 'Pilot', 'Show Yourself', 'Ships', 'Totem', 'Robot', 'Motic', 'Sha Na', 'Rooted Shrine', 'The Great Show', 'Two Maps And A Live Shot', 'hondo', 'Život', 'Whole', '60\'s Quiz Show', 'kotou', 'Times Be Short', 'rotor', 'hope!', 'WhoShall I Lah', 'Shock Therapy', 'Eliot', 'Booth', 'Rota 1', 'Rota 2', 'Rota 3', 'Moths', 'Noted', 'Ticho a samota', 'hithathuthot', 'Knots', 'Shhhh', 'Floot', 'For Who to Fail', 'Got Me', 'Take Off and Shoot a Zero', 'Makes Me Wanna Shoot You', 'Late Night Show', 'Ghost & Shadows', 'Shock Collared', 'Phone Booth Man', 'The Show Is Over', 'Feminist Short', 'Short Tempered', 'Shorter Piece 2', 'My Shoe Fell Off', 'Shopping Music', 'Different shot', 'Shortloopplay', 'Mother\'s Shawl', 'Summer Showers', 'hotfukdetekta', 'Not Your Choice', 'Gunshot Orgazm', 'Brogez/Sholem', 'Shark on the Lot', 'Vitamin Shoppe', 'Shock Corridor', 'Dancing Photon', 'Shower Request', 'The Photograph', 'Bare Shoulders', 'Showers of Pain', 'Khobe Schkotch', 'Head Of The Shop', 'Do Not Talk Shit', 'Meteors Shower', 'Distant Shores', 'Walk In My Shoes', 'Shower of Fruit', 'Nashotah Falls', 'Kyoketsu Shoge', 'Upon Our Shores', 'Imhotep\'s Tomb', 'Shopping - 2014', 'Drottningholm', 'Haunted Shores', 'Slow Short Acid', 'Aim Shoot Bang Fire March', 'Legal (Ganja Shot remix)')
, 
field(genre.title, 'Lo-Fi'),
field(t.artistName, 'Glass Boy') 
LIMIT 100;
;

SELECT t.id, t.artistName, genre.title AS genre FROM (SELECT track.*, trackGenres.genreID FROM track JOIN trackGenres ON track.id=trackGenres.trackID) AS t JOIN genre ON genre.id =t.genreID;

SELECT title, artistName FROM track;
SELECT trackID FROM trackGenres JOIN genre on genre.id = trackGenres.genreID WHERE genre.id = 1;

SELECT playlistReview.*, user.userName FROM playlistReview JOIN user ON user.id=playlistReview.userID WHERE playlistID=7;
SELECT publicVisibility FROM playlist WHERE id=7;
SELECT list.*, averageRating FROM (SELECT playlistID, userName, name, dateLastChanged, publicVisibility, description, numOfTracks, duration 
FROM user JOIN (
SELECT * FROM playlist LEFT JOIN (
SELECT COUNT(*) AS numOfTracks, SEC_TO_TIME(SUM(time_to_sec(duration))) AS duration, p.playlistID  
FROM playlistTrack AS p JOIN track AS t ON t.id = p.trackID GROUP BY p.playlistID) AS a ON a.playlistID = playlist.id 
WHERE playlist.publicVisibility=1) AS res on res.userID = user.id ORDER BY dateLastChanged DESC LIMIT 10) AS list
LEFT JOIN (SELECT playlistID, AVG(rating) AS averageRating FROM playlistReview GROUP BY playlistID) AS ratings 
ON ratings.playlistID=list.playlistID;

SELECT * FROM playlist;
UPDATE playlist SET publicVisibility=1 WHERE id=11;

SELECT id AS playlistID, userName, name, dateLastChanged, publicVisibility, description, numOfTracks, duration, averageRating FROM 
(SELECT res.id, userName, name, dateLastChanged, publicVisibility, description, numOfTracks, duration 
FROM user JOIN (
SELECT * 
FROM playlist LEFT JOIN (
SELECT COUNT(*) AS numOfTracks, SEC_TO_TIME(SUM(time_to_sec(duration))) AS duration, p.playlistID  
FROM playlistTrack AS p 
JOIN track AS t ON t.id = p.trackID GROUP BY p.playlistID) AS a ON a.playlistID = playlist.id 
WHERE playlist.userID=72) AS res on res.userID = user.id ORDER BY dateLastChanged DESC) AS list
LEFT JOIN (SELECT playlistID, AVG(rating) AS averageRating FROM playlistReview GROUP BY playlistID) AS ratings ON ratings.playlistID=list.id;
