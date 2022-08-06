require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
// const session = require('cookie-session');
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
mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true }, (err) => {
	if (err) console.log(err);
	else console.log('Connected to database server successfully.');
});

const userSchema = new mongoose.Schema({
	username: String,
	googleId: String,
	facebookId: String,
	secrets: [],
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
			callbackURL: process.env.WEB_URL + '/auth/google/callback',
		},
		(accessToken, refreshToken, profile, cb) => {
			User.findOne({ googleId: profile.id }, (err, user) => {
				if (err) console.log(err);

				if (user) {
					return cb(err, user);
				} else {
					user = new User({
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
			callbackURL: process.env.WEB_URL + '/auth/facebook/callback',
			profileFields: ['id', 'emails', 'name'],
		},
		(accessToken, refreshToken, profile, cb) => {
			User.findOne({ facebookId: profile.id }, (err, user) => {
				if (err) console.log(err);

				if (user) {
					return cb(err, user);
				} else {
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

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
	res.redirect('/secrets');
});

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
	res.redirect('/secrets');
});

////////////////////////////////////////////
// Routes
////////////////////////////////////////////
app.get('/', (req, res) => {
	if (req.isAuthenticated()) res.redirect('secrets');
	else res.render('home');
});

app.route('/login')
	.get((req, res) => {
		if (req.isAuthenticated()) res.redirect('/secrets');
		else res.render('login');
	})
	.post((req, res, next) => {
		const user = new User({
			username: req.body.username,
			password: req.body.password,
		});

		req.login(user, (err) => {
			if (err) {
				next(err);
			} else {
				passport.authenticate('local', (err, user, info) => {
					if (err) next(err);
					if (!user) next('User or password are incorrect.');
				})(req, res, () => {
					res.redirect('/secrets');
				});
			}
		});
	});

app.route('/register')
	.get((req, res) => {
		if (req.isAuthenticated()) res.redirect('/secrets');
		else res.render('register');
	})
	.post((req, res, next) => {
		const { username, password } = req.body;

		User.findOne({ username }, (err, foundUser) => {
			if (err) next(err);
			else if (foundUser) res.redirect('/login');
			else {
				User.register({ username }, password, (err, user) => {
					if (err) return next(err);

					passport.authenticate('local')(req, res, () => {
						res.redirect('/secrets');
					});
				});
			}
		});
	});

app.get('/secrets', (req, res, next) => {
	// User.find({ secrets: { $ne: null } }, (err, foundUsers) => {
	User.find({ 'secrets.0': { $exists: true } }, (err, foundUsers) => {
		if (err) return next(err);

		const secretsArr = [];
		foundUsers.map((user) => user.secrets.map((secret) => secretsArr.push(secret)));
		res.render('secrets', { secrets: secretsArr });
	});
});

app.get('/logout', (req, res) => {
	req.logout((err) => {
		if (err) console.log(err);
		res.redirect('/');
	});
});

app.route('/submit')
	.get((req, res, next) => {
		if (!req.isAuthenticated()) return next('Your are not logged in.');

		User.findById(req.user?.id, (err, foundUser) => {
			if (err) return next(err);

			if (foundUser) {
				res.render('submit', { userSecrets: foundUser.secrets });
			}
		});
	})
	.post((req, res, next) => {
		if (!req.isAuthenticated()) return res.redirect('/login');

		const { secret } = req.body;
		if (!secret) return res.redirect('/submit');

		User.findById(req.user?.id, (err, foundUser) => {
			if (err) return next(err);

			if (foundUser) {
				foundUser.secrets.push(secret);
				foundUser.save((e) => {
					if (e) return next(e);
					res.redirect('/secrets');
				});
			} else {
				next("User wasn/'t found while trying to submiting a secret.");
				res.redirect('/secrets');
			}
		});
	});

app.post('/delete/:secretIndex', (req, res, next) => {
	if (!req.isAuthenticated()) return next('You are not logged in.');

	const { secretIndex } = req.params;

	User.findById(req.user?.id, (err, foundUser) => {
		if (err) return next(err);

		if (foundUser) {
			foundUser.secrets.splice(secretIndex, 1);
			foundUser.save((e) => {
				if (e) return next(e);
				res.redirect('/submit');
			});
		}
	});
});
////////////////////////////////////////////
// MiddleWare
////////////////////////////////////////////
app.use((err, req, res, next) => {
	console.error(err);
	res.render('error', { errorMessage: err });
});

////////////////////////////////////////////
// App Listen
////////////////////////////////////////////
app.listen(process.env.PORT || '3000', () => {
	console.log(`Server started on port ${process.env.PORT || 3000}`);
});