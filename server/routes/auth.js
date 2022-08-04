const router = require('express').Router();
const passport = require('passport');
const User = require('../models/users');

const error = (res, code, err) => res.status(code).json({ error: err });

router.get('/login/success', (req, res) => {
	if (req.user) {
		res.status(200).json({
			success: true,
			message: 'successfull',
			user: req.user,
			// cookies: req.cookies,
		});
	} else res.json({ success: false });
});

router.get('/login/failed', (req, res) => {
	res.status(401).json({
		success: false,
		message: 'failure',
	});
});

router.get('/logout', (req, res) => {
	req.logout((err) => {
		if (err) console.log(err);
		res.status(200).json({ success: err ? false : true });
	});
});

const authUrlObj = { successRedirect: 'http://localhost:3000/cb/google', failureRedirect: '/login/failed' };

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', authUrlObj));

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', authUrlObj));

router.post('/login', (req, res) => {
	console.log('user trying to login');
	const user = new User({
		username: req.body.username,
		password: req.body.password,
	});
	console.log(user);

	req.login(user, (err) => {
		if (err) return error(res, 500, err);

		passport.authenticate('local', (err, user, info) => {
			if (err) error(res, 401, err);
			if (!user) {
				error(res, 401, 'User or password are incorrect.');
			} else res.status(200).json({ success: true });
		})(req, res, () => res.status(200).json({ success: true }));
	});
});

router.post('/register', (req, res) => {
	const { username, password } = req.body;

	User.findOne({ username }, (err, foundUser) => {
		if (err) return error(res, 500, err);

		if (foundUser) res.status(200).json({ success: false });
		else {
			User.register({ username }, password, (err, user) => {
				if (err) return error(res, 500, err);
				// res.status(200).json({ success: true });

				passport.authenticate('local')(req, res, () => {
					// res.redirect('/secrets');
					res.status(200).json({ success: true });
				});
			});
		}
	});
});

module.exports = router;
