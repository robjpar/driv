CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin TINYINT NOT NULL,
    UNIQUE INDEX `user_id_UNIQUE` (`id` ASC), 
    UNIQUE INDEX `email_UNIQUE` (`email` ASC),
    PRIMARY KEY (user_id)
)
