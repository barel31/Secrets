const router = require('express').Router();
const User = require('../models/users');
const Feedback = require('../models/feedback');

const error = (res, code, err) => {
	console.log(`${Date()}: ${code} - ${err}`);
	res.status(code).json({ error: err });
};

router.get('/secrets', (req, res) => {
	User.find({ 'secrets.0': { $exists: true } }, (err, foundUsers) => {
		if (err) return error(res, 401, err);

		const secretsArr = [];
		foundUsers.map((user) =>
			user.secrets.map((secret) => {
				if (!secret.isPrivate) secretsArr.push(secret.secret);
			})
		);
		res.json({ secrets: secretsArr });
	});
});

router
	.route('/user/secrets')
	.get((req, res) => {
		if (!req?.user?.id) return error(res, 401, 'User unauthorized.');

		User.findById(req?.user?.id, (err, found) => {
			if (err) return error(res, 500, err);

			res.status(200).json({ secrets: found?.secrets });
		});
	})
	.delete((req, res) => {
		if (!req.user.id) return error(res, 401, 'User unauthorized.');

		const { secretIndex } = req.body;

		User.findById(req.user.id, (err, found) => {
			if (err) return error(res, 500, error);

			if (secretIndex >= found.secrets.length) return error(res, 400, 'Invalid secret index.');

			found.secrets.splice(secretIndex, 1);

			found.save((err) => {
				if (err) return error(res, 400, 'Unable to save user data.');
				res.status(200).json({ secrets: found.secrets });
			});
		});
	})
	.patch((req, res) => {
		if (!req.user.id) return error(res, 401, 'User unauthorized.');

		const { secretIndex, isPrivate } = req.body;

		User.findById(req.user.id, (err, found) => {
			if (err) return error(res, 500, error);

			if (secretIndex >= found.secrets.length) return error(res, 400, 'Invalid secret index.');

			found.secrets[secretIndex].isPrivate = isPrivate;

			found.save((err) => {
				if (err) return error(res, 400, 'Unable to save user data.');
				res.status(200).json({ secrets: found.secrets });
			});
		});
	})
	.post((req, res) => {
		if (!req.user) return error(res, 401, 'User unauthorized.');

		const { secret, isPrivate } = req.body;

		if (!secret || typeof isPrivate !== 'boolean') return error(res, 400, 'mismatch arguments.');

		User.findById(req.user.id, (err, foundUser) => {
			if (err) return error(res, 400, err);

			if (foundUser) {
				foundUser.secrets.push({ secret, isPrivate });
				foundUser.save((e) => {
					if (e) return error(res, 400, e);
					res.status(200).json({ saved: true });
				});
			} else {
				error(res, 400, "User wasn/'t found while trying to submiting a secret.");
			}
		});
	});

router.get('/user/username', (req, res) => {
	if (req.user) {
		User.findById(req.user.id, (err, found) => {
			if (err) error(res, 500, err);

			if (found) res.status(200).json({ username: found.username });
			else res.status(401).json({ error: 'Unable to found user.' });
		});
	} else res.status(401).json({ error: 'Unable to find user.' });
});

router.post('/feedback', (req, res) => {
	if (req.body.length <= 2) return error(res, 400, 'Missed parameters.');

	new Feedback({
		name: { first: req.body.firstName, last: req.body.lastName },
		range: req.body.range,
		comments: req.body.comments,
	}).save((err) => {
		if (err) return error(res, 500, err);

		res.status(200).json({ success: true });
	});
});

module.exports = router;
