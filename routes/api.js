const router = require('express').Router();
const User = require('../models/users');

const error = (res, code, err) => {
	console.log(`${Date()}: ${code} - ${err}`);
	res.status(code).json({ error: err });
};

router.post('/secrets', (req, res) => {
	User.find({ 'secrets.0': { $exists: true } }, (err, foundUsers) => {
		if (err) return error(res, 401, err);

		const secretsArr = [];
		foundUsers.map((user) =>
			user.secrets.map((secret) => {
				if (secret.isPrivate !== 'true') secretsArr.push(secret.secret);
			})
		);
		console.log(secretsArr);
		res.json({ secrets: secretsArr });
	});
});

router.post('/user/secrets', (req, res) => {
	if (!req?.user?.id) return error(res, 401, 'User unauthorized.');

	User.findById(req?.user?.id, (err, found) => {
		if (err) return error(res, 500, err);

		res.status(200).json({ secrets: found?.secrets });
	});
});

router.post('/user/delete/', (req, res) => {
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
});

router.post('/submit', (req, res) => {
	if (!req.user) return error(res, 401, 'User unauthorized');

	const { secret, isPrivate } = req.body;

	if (!secret || (isPrivate !== 'true' && isPrivate !== 'false' && isPrivate !== 'on'))
		return error(res, 400, 'Empty arguments.');

	User.findById(req.user.id, (err, foundUser) => {
		if (err) return error(res, 400, err);

		if (foundUser) {
			foundUser.secrets.push({ secret, isPrivate: isPrivate === 'true' ? true : false });
			foundUser.save((e) => {
				if (e) return error(res, 400, e);
				res.status(200).json({ saved: true });
			});
		} else {
			error(res, 400, "User wasn/'t found while trying to submiting a secret.");
		}
	});
});

router.get('/username', (req, res) => {
	if (req.user) {
		User.findById(req.user.id, (err, found) => {
			if (err) console.log(err);

			if (found) {
				res.status(200).json({ username: found.username });
			} else res.status(401).json({ error: 'Unable to found user.' });
		});
	} else res.status(401).json({ error: 'Unable to find user.' });
});

module.exports = router;
