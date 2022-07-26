const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
////////////////////////////////////////////
// Express setup
////////////////////////////////////////////
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

////////////////////////////////////////////
// mongoose setup
////////////////////////////////////////////
mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({
	email: String,
	password: String,
});

const User = new mongoose.model('User', userSchema);

////////////////////////////////////////////
// Routes
////////////////////////////////////////////
app.get('/', (req, res) => {
	res.render('home');
});

app.route('/login')
	.get((req, res) => {
		res.render('login');
	})
	.post((req, res) => {
		const { username, password } = req.body;

		User.findOne({ username: username }, (err, foundUser) => {
			if (err) {
				console.log(err);
			} else {
				if (foundUser) {
					bcrypt.compare(password, foundUser.password, (err, result) => {
						if (err) {
							console.log(err);
						} else if (result) {
							res.render('secrets');
						} else {
							res.send('Bad password.');
						}
					});
				} else {
					res.send('Unable to find user.');
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

		bcrypt.hash(password, saltRounds, (err, hash) => {
			if (err) {
				console.log(err);
			} else {
				User.findOne({ email: username }, (err, foundUser) => {
					if (err) {
						console.log(err);
					} else if (foundUser) {
						res.send('User already exists!');
					} else {
						new User({ email: username, password: hash }).save((err) => {
							if (err) console.log(err);
							else res.render('secrets');
						});
					}
				});
			}
		});
	});

////////////////////////////////////////////
// App Listen
////////////////////////////////////////////
app.listen(process.env.PORT || '3000', () => {
	console.log(`Server started on port ${process.env.PORT || 3000}`);
});
