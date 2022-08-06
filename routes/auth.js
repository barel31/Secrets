const router = require('express').Router();
const passport = require('passport');

const User = require('../models/users');

const error = (res, code, err) => {
	console.log(`${Date()}: ${code} - ${err}`);
	res.status(code).json({ error: err });
};

router.get('/login/success', (req, res) => {
	if (req.user) {
		User.findById(req.user.id, (err, user) => {
			if (err) return error(res, 500, err);

			res.status(200).json({
				success: true,
				message: 'successfull',
				user,
				// cookies: req.cookies,
			});
		});
	} else res.status(200).json({ success: false });
});

router.get('/login/failed', (req, res) => {
	res.status(401).json({
		success: false,
		message: 'failure',
	});
});

router.get('/logout', (req, res) => {
	req.logout((err) => {
		if (err) return error(res, 500, err);
		res.status(200).json({ success: err ? false : true });
	});
});

const authUrlObj = { successRedirect: `${process.env.WEB_URL}/cb/google`, failureRedirect: '/login/failed' };

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', authUrlObj));

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', authUrlObj));

router.post('/login', (req, res) => {
	User.findOne({ username: req.body.username }, (err, user) => {
		if (err) error(res, 500, err);

		req.login(user, (err) => {
			if (err) return error(res, 500, err);

			passport.authenticate('local', (err, user, info) => {
				if (err) error(res, 401, err);
				else if (!user) error(res, 401, 'User or password are incorrect.');
				else res.status(200).json({ success: true });
			})(req, res, () => res.status(200).json({ success: true }));
		}); 
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

				passport.authenticate('local')(req, res, () => res.status(200).json({ success: true }));
			});
		}
	});
});

module.exports = router;
