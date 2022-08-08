const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('./models/users');

passport.use(User.createStrategy());

passport.serializeUser((user, cb) => {
	process.nextTick(() => {
		cb(null, { id: user?.id });
	});
});

passport.deserializeUser((user, cb) => {
	process.nextTick(() => {
		return cb(null, user);
	});
});

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: process.env.WEB_URL + '/auth/callback/google',
		},
		(accessToken, refreshToken, profile, cb) => {
			User.findOne({ googleId: profile.id }, (err, user) => {
				if (err) log(err);

				if (user) {
					return cb(err, user);
				} else {
					user = new User({
						username: profile.emails[0].value,
						googleId: profile.id,
					}).save((e) => {
						if (e) log(e);
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
			callbackURL: process.env.WEB_URL + '/auth/callback/facebook',
			profileFields: ['id', 'emails', 'name'],
		},
		(accessToken, refreshToken, profile, cb) => {
			User.findOne({ facebookId: profile.id }, (err, user) => {
				if (err) log(err);

				if (user) {
					return cb(err, user);
				} else {
					user = new User({
						username: profile.emails[0].value,
						facebookId: profile.id,
					}).save((e) => {
						if (e) log(e);
						return cb(err, user);
					});
				}
			});
		}
	)
);
