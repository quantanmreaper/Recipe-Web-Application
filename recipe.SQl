-- Create table for users
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    usertype VARCHAR(50) NOT NULL, -- Can store roles like 'admin', 'regular'
    password VARCHAR(255) NOT NULL,
    profilephoto BLOB -- Storing image as binary data
);

-- Create table for admins
CREATE TABLE admins (
    admin_id INTEGER PRIMARY KEY,
    admin_name VARCHAR(255) NOT NULL,
    admin_email VARCHAR(255) UNIQUE NOT NULL,
    admin_password VARCHAR(255) NOT NULL
);

-- Create table for categories
CREATE TABLE category (
    category_id INTEGER PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

-- Create table for recipes
CREATE TABLE recipe (
    recipe_id INTEGER PRIMARY KEY,
    recipe_name VARCHAR(255) NOT NULL,
    ingredients TEXT NOT NULL,
    recipe_steps TEXT NOT NULL,
    finalimage BLOB, -- Storing image as binary data
    user_id INTEGER NOT NULL,
    category_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category (category_id) ON DELETE SET NULL
);

-- Create table for reviews
CREATE TABLE reviews (
    review_id INTEGER PRIMARY KEY,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    timecreatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    recipe_id INTEGER NOT NULL,
    FOREIGN KEY (recipe_id) REFERENCES recipe (recipe_id) ON DELETE CASCADE
);

-- Create table for cooking tutorials
CREATE TABLE cookingtutorials (
    tutorial_id INTEGER PRIMARY KEY,
    tutorial_link VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);
