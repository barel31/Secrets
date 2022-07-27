const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

////////////////////////////////////////////
// Express setup
////////////////////////////////////////////
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
	session({
		secret: 'SECRET_HERE',
		resave: false,
		saveUninitialized: false,
	})
);

app.use(passport.initialize());
app.use(passport.session());

////////////////////////////////////////////
// mongoose setup
////////////////////////////////////////////
mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({
	email: String,
	password: String,
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model('User', userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
		const user = new User({
			username: req.body.username,
			password: req.body.password,
		});

		req.login(user, (err) => {
			if (err) {
				console.log(err);
			} else {
				passport.authenticate('local')(req, res, () => {
					res.redirect('/secrets');
				});
			}
		});
	});

app.route('/register')
	.get((req, res) => {
		res.render('register');
	})
	.post((req, res) => {
		const { username, password } = req.body;

		User.findOne({ username }, (err, foundUser) => {
			if (err) {
				console.log(err);
			} else if (foundUser) {
				res.redirect('/login');
			} else {
				User.register({ username }, password, (err, user) => {
					if (err) {
						console.log(err);
						res.redirect('register');
					} else {
						passport.authenticate('local')(req, res, () => {
							res.redirect('/secrets');
						});
					}
				});
			}
		});
	});

app.get('/secrets', (req, res) => {
	if (req.isAuthenticated()) {
		res.render('secrets');
	} else {
		res.redirect('/login');
	}
});

app.get('/logout', (req, res) => {
	req.logout((err) => {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/');
		}
	});
});

////////////////////////////////////////////
// App Listen
////////////////////////////////////////////
app.listen(process.env.PORT || '3000', () => {
	console.log(`Server started on port ${process.env.PORT || 3000}`);
});
