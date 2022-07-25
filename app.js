require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

// Express setup

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// mongoose setup

mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({
	email: String,
	password: String,
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = new mongoose.model('User', userSchema);

// Routes

app.get('/', (req, res) => {
	res.render('home');
});

app.route('/login')
	.get((req, res) => {
		res.render('login');
	})
	.post((req, res) => {
		const { username, password } = req.body;

		User.findOne({ username: username }, (err, found) => {
			if (err) {
				console.log(err);
			} else {
				if (found) {
					if (found.password === password) {
						res.render('secrets');
					} else {
						res.send('BAD PASSWORD');
					}
				} else {
					res.send('BAD USER');
				}
			}
		});
	});

app.route('/register')
	.get((req, res) => {
		res.render('register');
	})
	.post((req, res) => {
		const { username, password } = req.body;

		new User({ email: username, password: password }).save((err) => {
			if (err) console.log(err);
			else res.render('secrets');
		});
	});

// App Listen

app.listen(process.env.PORT || '3000', () => {
	console.log(`Server started on port ${process.env.PORT || 3000}`);
});
