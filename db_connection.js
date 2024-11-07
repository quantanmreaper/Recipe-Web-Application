/*  const mysql = require('mysql');

//creating the connection pool
let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "recipeapp"
});

con.connect(function(err) {
    if (err) {throw err;}
    console.log("Connected Successfully!");

   

        let sql = "INSERT INTO admins (admin_name, admin_email, admin_password) VALUES ('Mepani', 'mepani@gmail.com', 'mepani123')";

        con.query(sql, function(err, result){
            if (err) {throw err;}
            console.log('Data inserted successfully');
        });
});
 

 */
const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const { emitWarning } = require('process');

const app = express();

app.set('view engine', 'ejs'); // Set up EJS (embedded JavaScript template)

app.set('views', path.join(__dirname, 'views'));

// Corrected static file serving
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

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/categories', (req, res) => {
    res.render('categories');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/profile', (req, res) => {
    res.render('profile')/*  ,{
        fullname: "Mepani",
        username: "mepaniBhavin",
        email: "mepani@gmail.comm",
        password : "mepani123" */
    

});

app.get('/recipe', (req, res) => {
    res.render('recipe');
});

app.get('/userreg', (req, res) => {
    res.render('userreg');
});
app.get('/favorites', (req, res) => {
    res.render('favorites'); 
});

app.get('/tutorials', (req, res) => {
    res.render('tutorials'); 
});

// Middleware to parse URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.memoryStorage({
    destination: (req, file, callback) => {
        const uploadPath = path.join(__dirname, 'uploads');
        if(!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
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

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'recipereg.html')); // Ensure the path is correct
});

// Handle the form submission for recipes
app.post('/recipe-submission', upload.single('recipephoto'), function(req, res) {
    const { recipename, ingredients, recipesteps, recipecategory } = req.body;
    const recipePhotoPath = req.file ? '/uploads/' + req.file.filename : null;

    console.log("Form data received:", req.body); // Debugging line

    const sql = "INSERT INTO recipe (recipe_name, ingredients, recipe_steps, category, finalimage) VALUES (?, ?, ?, ?, ?)";

    con.query(sql, [recipename, ingredients, recipesteps, recipecategory, recipePhotoPath], function(err, result) {
        if (err) {
            console.error("Error inserting data:", err);
            return res.status(500).send("Database error");
        }
        console.log("Recipe data inserted successfully");
        res.send("Recipe submitted successfully!");
    });
});

// New route for displaying all the recipes
app.get('/recipe/:id', (req, res) => {

    const recipeId = req.params.id;
    // Query to get the recipe
    let sql = "SELECT recipe_name, ingredients, recipe_steps, category , nutritional_value FROM recipe WHERE recipe_id = ?";

    con.query(sql, [recipeId], (err, results) => {
        if (err) {
            console.error("Error fetching recipe:", err);
            return res.status(500).send("Database error");
        }
        if(results.length >0){
            res.render('recipe', {recipe: results[0]});
        }
        else{
            res.status(404).send("Recipe not found");
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log(`Server is running on port ${PORT}`);
});
