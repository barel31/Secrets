require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

////////////////////////////////////////////
// Express setup
////////////////////////////////////////////
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
	session({
		secret: process.env.SESSION_SECRET,
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
	username: String,
	googleId: String,
	facebookId: String,
	secret: String,
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model('User', userSchema);

passport.use(User.createStrategy());

passport.serializeUser((user, cb) => {
	process.nextTick(() => {
		cb(null, { id: user.id });
	});
});

passport.deserializeUser((user, cb) => {
	process.nextTick(() => {
		return cb(null, user);
	});
});

////////////////////////////////////////////
// OAuth
////////////////////////////////////////////
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: 'http://localhost:3000/auth/google/callback',
		},
		(accessToken, refreshToken, profile, cb) => {
			User.findOne({ googleId: profile.id }, (err, foundUser) => {
				if (err) console.log(err);

				if (foundUser) {
					console.log(foundUser);
					return cb(err, foundUser);
				} else {
					console.log('create google user.');
					const user = new User({
						username: profile.emails[0].value,
						googleId: profile.id,
					}).save((e) => {
						if (e) console.log(e);
						return cb(err, user);
					});
				}
			});
		}
	)
);

passport.use(
	new FacebookStrategy(
		{
			clientID: process.env.FACEBOOK_APP_ID,
			clientSecret: process.env.FACEBOOK_APP_SECRET,
			callbackURL: 'http://localhost:3000/auth/facebook/callback',
			profileFields: ['id', 'emails', 'name'],
		},
		(accessToken, refreshToken, profile, cb) => {
			User.findOne({ facebookId: profile.id }, (err, user) => {
				if (err) console.log(err);

				if (user) {
					console.log(user);
					return cb(err, user);
				} else {
					console.log('create facebook user.');
					user = new User({
						username: profile.emails[0].value,
						facebookId: profile.id,
					}).save((e) => {
						if (e) console.log(e);
						return cb(err, user);
					});
				}
			});
		}
	)
);

////////////////////////////////////////////
// Routes
////////////////////////////////////////////
app.get('/', (req, res) => {
	res.render('home');
});

// Google Auth
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
	console.log('redirected to /secrets by google');
	res.redirect('/secrets');
});

// Facebook Auth
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
	console.log('redirected to /secrets by facebook');
	res.redirect('/secrets');
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
	User.find({ secret: { $ne: null } }, (err, foundUsers) => {
		if (err) {
			console.log(err);
		} else {
			const secrets = foundUsers.map((v) => v.secret);
			res.render('secrets', { secrets: secrets });
		}
	});
});

app.get('/logout', (req, res) => {
	req.logout((err) => {
		if (err) {
			console.log(err);
		} else {
			console.log('logged out user');
			res.redirect('/');
		}
	});
});

app.route('/submit')
	.get((req, res) => {
		if (req.isAuthenticated()) {
			res.render('submit');
		} else {
			res.redirect('/login');
		}
	})
	.post((req, res) => {
		if (req.isAuthenticated()) {
			User.findById(req.user?.id, (err, foundUser) => {
				if (err) {
					console.log(err);
				} else {
					if (foundUser) {
						foundUser.secret = req.body.secret;
						foundUser.save(() => res.redirect('/secrets'));
					} else {
						console.log("User didn't found while trying to submiting a secret.");
						res.redirect('/secrets');
					}
				}
			});
		}
	});

////////////////////////////////////////////
// App Listen
////////////////////////////////////////////
app.listen(process.env.PORT || '3000', () => {
	console.log(`Server started on port ${process.env.PORT || 3000}`);
});
