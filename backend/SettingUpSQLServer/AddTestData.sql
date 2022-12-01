#stuff to change on server database
ALTER TABLE expiredRefreshJWT RENAME expiredJWT;

ALTER TABLE user MODIFY COLUMN email VARCHAR(320) NOT NULL UNIQUE;

##make the email in the user table unqiue
SELECT * FROM user;

DELETE FROM user;

