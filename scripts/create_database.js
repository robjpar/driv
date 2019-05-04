/**
 * Created by barrett on 8/28/14.
 */

const mysql = require('mysql');
const db = require('./models');

const connection = mysql.createConnection(db.connection);

connection.query('\
CREATE TABLE `referraldata_db`.`users` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `email` VARCHAR(20) NOT NULL, \
    `password` CHAR(60) NOT NULL, \
    `is_admin TINYINT DEFAULT false`, \
    PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    UNIQUE INDEX `username_UNIQUE` (`username` ASC) \
)');

console.log('Success: Database Created!');

connection.end();
