// Loading required modules
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signIn = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    }
});

db.select('*').from('users').then(data => {
    console.log(data);
});

// Initialize the app and declare the port
const app = express();
const port = 3001;

// Using body parser to read json notation
app.use(bodyParser.json());
app.use(cors());

// Root server response
app.get('/', (req, res) => { res.send(`It's FUCKING working`) });

// Sign-in actions
app.post('/signin', (req, res) => { signIn.handleSignin(req, res, db, bcrypt) });

// Register actions
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });

// Gets the user profile by ID
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });

// Increases the number of times that a user uploads an image
app.put('/image', (req, res) => { image.handleImage(req, res, db) });

app.post('/image', (req, res) => { image.handleApiCall(req, res) });

app.listen(process.env.PORT || port, () => {
    console.log(`app is running on port ${process.env.PORT}`);
});
