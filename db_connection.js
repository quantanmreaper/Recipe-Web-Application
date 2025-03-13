const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const session = require('express-session'); // use when checking the user logged in status
const { emitWarning } = require('process');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const app = express();

app.set('view engine', 'ejs'); // Set up EJS (embedded JavaScript template)
app.set('views', path.join(__dirname, 'views'));

// Corrected static file serving for css , js like static files
app.use(express.static('public'));

// Set up the database connection
let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "recipeapp"
});

con.connect(function(err) {
    if (err) {
        throw err;
    }
    console.log("Connected to the database successfully!");
});

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const uploadPath = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath); // Create the 'uploads' folder if it doesn't exist
        }
        callback(null, uploadPath);
    },
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        callback(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});
const upload = multer({ storage: storage });

app.use(express.urlencoded({ extended: true }));

// Configure session middleware
app.use(session({
    secret: 'your-strong-secret-key', // Replace with a strong, unique secret
    resave: false,
    saveUninitialized: true
}));

// Token verification middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, 'your-secret-key', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.get('/', (req, res) => {
    res.render('index', { loggedIn: req.session.loggedIn });
});

app.get('/categories', (req, res) => {
    res.render('categories');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/profile', (req, res) => {
    if (!req.session.loggedIn) {
        return res.redirect('/login');
    }

    const username = req.session.username; // Assuming username is stored in session
    const sql = "SELECT username, email, profilephoto, usertype FROM users WHERE username = ?"; // Include usertype

    con.query(sql, [username], (err, results) => {
        if (err) {
            console.error("Error fetching user details:", err);
            return res.status(500).send("Database error");
        }
        if (results.length > 0) {
            const user = results[0];
            res.render('profile', { user, loggedIn: req.session.loggedIn });
        } else {
            res.status(404).send("User not found");
        }
    });
});

app.get('/userreg', (req, res) => {
    res.render('userreg');
});

app.get('/tutorials', (req, res) => {
    res.render('tutorials', { loggedIn: req.session.loggedIn });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Serve the HTML file
app.get('/recipereg', (req, res) => {
    res.render('recipereg'); // Ensure the path is correct
});

app.get('/userreg', (req, res) => {
    res.sendFile(path.join(__dirname, '/userreg')); 
});

app.get('/login',(req, res) => {
    res.sendFile(path.join(__dirname, '/login')); 
});

app.get('/profile',(req, res) => {
    res.sendFile(path.join(__dirname, '/profile'));
});

// Handle the form submission for recipes
app.post('/recipe-submission', upload.single('recipephoto'), function(req, res) {
    try {
        const { recipename, ingredients, recipesteps, recipecategory, nutrition } = req.body;
        const recipePhotoPath = req.file ? '/uploads/' + req.file.filename : null;
    
        console.log("Form data received:", req.body); // Debugging line
    
        const sql = "INSERT INTO recipe (recipe_name, ingredients, recipe_steps, category, finalimage, nutritional_value) VALUES (?, ?, ?, ?, ?, ?)";
    
        con.query(sql, [recipename, ingredients, recipesteps, recipecategory, recipePhotoPath, nutrition], function(err, result) {
            if (err) {
                console.error("Error inserting data:", err);
                return res.status(500).send("Database error");
            }
            const insertedData = {
                recipe_name: recipename,
                ingredients: ingredients,
                recipe_steps: recipesteps,
                category: recipecategory,
                finalimage: recipePhotoPath,
                nutritional_value: nutrition
            };
            console.log("Inserted data:", JSON.stringify(insertedData, null, 2)); // Print JSON data on the console
            res.send(`
                <script>
                    alert('Successfully registered!');
                    window.location.href = '/';
                </script>
            `);
        });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).send("Server error");
    }
});

// Registration route
app.post('/api/user-submission', upload.single('profilephoto'), async (req, res) => {
    try {
        const { username, email, password, usertype, gender } = req.body;
        
        // Hash the password before storing
       // const hashedPassword = await bcrypt.hash(password, 10);

        // Get profile photo path if uploaded
        const profilePhotoPath = req.file ? '/uploads/' + req.file.filename : null;

        // SQL query for inserting user data
        const sql = `
            INSERT INTO users (username, email,usertype, password, gender,profilephoto) 
            VALUES (?, ?, ?, ?, ?,?)
        `;
        
        con.query(sql, [username, email,  usertype,password, gender ,profilePhotoPath], (err, result) => {
            if (err) {
                console.error("Error inserting data:", err);
                return res.status(500).send("Database error");
            }
            console.log("User registered successfully");
            res.send(`
                <script>
                    alert('Successfully registered!');
                    window.location.href = '/';
                </script>
            `);
        });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).send("Server error");
    }
});

app.post('/login-verification', async (req, res) => {
    console.log("Received login request");
    console.log("Request body:", req.body); // Debugging line to check form data
    try {
        const { username, password, usertype } = req.body;
        console.log("Parsed form data:", { username, password, usertype }); // Debugging line to check parsed data

        // SQL query to check if the user exists with the provided username, password, and usertype
        const sql = "SELECT * FROM users WHERE username = ? AND usertype = ? AND password = ?";
    
        con.query(sql, [username, usertype, password], (err, results) => {
            if (err) {
                console.error("Error fetching user:", err);
                return res.status(500).send("Database error");
            }
            console.log("Query results:", results); // Debugging line to check query results
    
            if (results.length > 0) {
                // If user is found, set session and redirect to the index page
                req.session.loggedIn = true;
                req.session.username = username; // Store username in session
                return res.send("<script>alert('Login Successful!'); window.location.href='/';</script>");
            } else {
                // If user is not found, show an alert and stay on the login page
                return res.send("<script>alert('Incorrect username or password'); window.location.href='/login';</script>");
            }
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Server error");
    }
});

// New route for displaying all the recipes
app.get('/recipe', async(req, res) => {
    const recipeId = req.params.id;
    let sql = "SELECT *FROM recipe";

    con.query(sql, [recipeId], (err, results) => {
        if (err) {
            console.error("Error fetching recipe:", err);
            return res.status(500).send("Database error");
        }
        const recipe = results.length > 0 ? results[0] : {};
        res.render('recipe', { recipe });
        
    });
}); 

app.get('/search', (req, res) => {
    const recipeName = req.query.query; // Get the search query from the request

    // Log the search query
    console.log('Search query:', recipeName);

    // Check if the recipeName is provided
    if (!recipeName) {
        return res.status(400).send('Search query is missing');
    }

    // Construct the SQL query for searching
    const sql = 'SELECT * FROM recipe WHERE recipe_name LIKE ? OR category LIKE ?';
    const likeQuery = `%${recipeName}%`; // Prepare for wildcard search

    // Execute the query with parameters
    con.query(sql, [likeQuery, likeQuery], (error, results) => {
        if (error) {
            console.error('Error searching recipes:', error);
            return res.status(500).send('Error searching recipes');
        }

        // Render results (assuming you have a results.ejs template)
        res.render('recipe', { recipe: results.length > 0 ? results[0] : null });
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error during logout:", err);
            return res.status(500).send("Server error");
        }
        res.redirect('/');
    });
});

app.get('/api/random-recipes', (req, res) => {
    const recipes = [
        { title: 'How to Make Spaghetti Carbonara', youtubeId: '3AAdKl1UYZs' },
        { title: 'Easy Homemade Pasta', youtubeId: 'HW2SoMJToIo' },
        { title: 'Classic Beef Stew', youtubeId: 'Nu7gCzxS5aM' },
        { title: 'Butter Chicken', youtubeId: 'a03U45jFxOI' },
        { title: 'Vegetarian Tacos', youtubeId: 'X8-Q-JHHSFw' },
        { title: 'How to Make Sushi at Home', youtubeId: 'joweUxpHaqc' },
        { title: 'Homemade Lasagna Recipe', youtubeId: 'qEowX-vOb4E' },
        { title: 'Perfect Chocolate Cake', youtubeId: 'xwKGZS3EE7Q' }
    ];
    res.json(recipes);
});

//below are the requests that return data in json format
app.get('/users', async(req, res) => {
    let sql = "SELECT * FROM users";
    con.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching users:", err);
            return res.status(500).send("Database error");
        }
        res.json(results);
    });
});

app.get('/recipes', async(req, res) => {
    const recipeId = req.params.id;
    let sql = "SELECT *FROM recipe";

    con.query(sql, [recipeId], (err, results) => {
        if (err) {
            console.error("Error fetching recipe:", err);
            return res.status(500).send("Database error");
        }
        res.json(results);
        
    });
}); 

app.get('/recipes/:id', async(req, res) => {
    const recipeId = req.params.id;
    let sql = "SELECT * FROM recipe WHERE recipe_id = ?";

    con.query(sql, [recipeId], (err, results) => {
        if (err) {
            console.error("Error fetching recipe:", err);
            return res.status(500).send("Database error");
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).send("Recipe not found");
        }
    });
});

app.get('/recipes-categories', async(req, res) => {
    let sql = "SELECT * FROM recipe ORDER BY category";
    con.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching users:", err);
            return res.status(500).send("Database error");
        }
        res.json(results);
    });
});

//below are the get and post using secure api endpoints
app.post('/api/register', async (req, res) => {
    try {
        const username = 'Messi';
        const email = 'messi@gmail.com';
        const password = 'nottherealGOAT';
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO api_users (username, email, password) VALUES (?, ?, ?)";
        con.query(sql, [username, email, hashedPassword], (err, result) => {
            if (err) {
                console.error("Error inserting data:", err);
                return res.status(500).send("Database error");
            }
            const token = jwt.sign({ userId: result.insertId }, 'your-secret-key', { expiresIn: '1h' });
            res.json({ message: 'API user registered successfully', token });
        });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).send("Server error");
    }
});

app.get('/api/recipes', authenticateToken, async (req, res) => {
    let sql = "SELECT * FROM recipe";
    con.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching recipes:", err);
            return res.status(500).send("Database error");
        }
        res.json(results);
    });
});
app.get('/all-users', authenticateToken, async(req, res) => {
    let sql = "SELECT * FROM users";
    con.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching users:", err);
            return res.status(500).send("Database error");
        }
        res.json(results);
    });
});
app.get('/users-gender', authenticateToken, async(req, res) => {
    let sql = "SELECT * FROM users ORDER BY gender";
    con.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching users:", err);
            return res.status(500).send("Database error");
        }
        res.json(results);
    });
});
app.get('/users-email/:email', authenticateToken, async(req, res) => {
    const email = req.params.email;
    let sql = "SELECT * FROM users WHERE email = ?";
    con.query(sql,[email], (err, results) => {
        if (err) {
            console.error("Error fetching users:", err);
            return res.status(500).send("Database error");
        }
        res.json(results);
    });
});

app.get('/api/test', (req, res) => {
    res.send('API is working');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log(`Server is running on port ${PORT}`);
});
