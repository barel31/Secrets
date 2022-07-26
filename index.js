require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
// const session = require('cookie-session');
const passport = require('passport');
const path = require('path');
const cors = require('cors');

require('./passport');
const authRoute = require('./routes/auth');
const apiRoute = require('./routes/api');
const adminRoute = require('./routes/admin');

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
		maxAge: 24 * 60 * 100,
	})
);

app.use(passport.initialize());
app.use(passport.session());

// OAuth Routes
app.use('/auth', authRoute);

// API
app.use('/api', apiRoute);

// ADMIN
app.use('/admin', adminRoute);

app.use('/static', express.static(path.join(__dirname, '/client/build/static')));
app.get('/*', (req, res) => {
	res.sendFile('index.html', { root: path.join(__dirname, '/client/build/') });
});

app.listen(process.env.PORT || '3000', () => {
	console.log(`${Date()}: Server started on port ${process.env.PORT || 3000}`);
});
