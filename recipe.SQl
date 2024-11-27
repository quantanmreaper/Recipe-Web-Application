-- Create table for users
CREATE TABLE users (
    user_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    usertype VARCHAR(50) NOT NULL, -- Can store roles like 'admin', 'regular'
    password VARCHAR(255) NOT NULL,
    profilephoto BLOB -- Storing image as binary data
);

-- Create table for admins
CREATE TABLE admins (
    admin_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    admin_name VARCHAR(255) NOT NULL,
    admin_email VARCHAR(255) UNIQUE NOT NULL,
    admin_password VARCHAR(255) NOT NULL
);



-- Create table for recipes
CREATE TABLE recipe (
    recipe_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    recipe_name VARCHAR(255) NOT NULL,
    ingredients TEXT NOT NULL,
    recipe_steps TEXT NOT NULL,
    category VARCHAR(255),
    finalimage BLOB, -- Storing image as binary data
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

-- Create table for reviews
CREATE TABLE reviews (
    review_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    timecreatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    recipe_id INTEGER NOT NULL,
    FOREIGN KEY (recipe_id) REFERENCES recipe (recipe_id) ON DELETE CASCADE
);

-- Create table for cooking tutorials
CREATE TABLE cookingtutorials (
    tutorial_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    tutorial_link VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);
CREATE TABLE api_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);