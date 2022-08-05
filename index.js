require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
// const session = require('cookie-session');
const passport = require('passport');
const path = require('path');
const cors = require('cors');
const forceSSL = require('express-force-ssl');

require('./passport');
const authRoute = require('./routes/auth');
const apiRoute = require('./routes/api');

//!Implement dates and secret search and sort-by

const log = (str) => console.log(`${Date()}: ${str}`);
module.exports = log;

////////////////////////////////////////////
// Express setup
////////////////////////////////////////////
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	cors({
		origin: 'http://localhost:3001',
		methods: 'GET,POST,PUT,DELETE',
		credentials: false,
	})
);

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		// name: 'session',
		// keys: ['secrets'],
		maxAge: 24 * 60 * 100,
	})
);

app.use(passport.initialize());
app.use(passport.session());

////////////////////////////////////////////
// mongoose setup
////////////////////////////////////////////
////////////////////////////////////////////
// Passport
////////////////////////////////////////////
////////////////////////////////////////////
// Routes
////////////////////////////////////////////

// OAuth Routes
app.use('/auth', authRoute);

// API
app.use('/api', apiRoute);

////////////////////////////////////////////
// MiddleWare
////////////////////////////////////////////

app.set('forceSSLOptions', {
	enable301Redirects: true,
	trustXFPHeader: false,
	httpsPort: 443,
	sslRequiredMessage: 'SSL Required.',
});

// const production = true;
const production = false;

if (production) {
	app.use(express.static(path.join(__dirname, '/client/build/')));
	console.log('production');
} else {
	app.use('/static', express.static(path.join(__dirname, '/client/build/static')));
	app.get('/*', function (req, res) {
		res.sendFile('index.html', { root: path.join(__dirname, '/client/build/') });
	});
}

////////////////////////////////////////////
// App Listen
////////////////////////////////////////////

app.listen(process.env.PORT || '3000', () => {
	log(`Server started on port ${process.env.PORT || 3000}`);
});
