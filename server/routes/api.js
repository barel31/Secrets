const router = require('express').Router();
const User = require('../models/users');

const error = (res, code, err) => res.status(code).json({ error: err });

router.post('/secrets', (req, res) => {
	User.find({ 'secrets.0': { $exists: true } }, (err, foundUsers) => {
		if (err) return error(res, 401, err);

		const secretsArr = [];
		foundUsers.map((user) => user.secrets.map((secret) => secretsArr.push(secret)));
		res.json({ secrets: secretsArr });
	});
});

router.post('/user/secrets', (req, res) => {
	if (!req.user) return error(res, 401, 'User not authorized.');

	User.findById(req?.user?.id, (err, found) => {
		if (err) return error(res, 500, err);

		res.status(200).json({ secrets: found?.secrets });
	});
});

router.post('/user/delete/:secretIndex', (req, res) => {
	if (!req.user) return error(res, 401, 'User not authorized.');

	const { secretIndex } = req.params;

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

router.post('/user/add/:secret', (req, res) => {
	const { secret } = req.params;

	if (!req?.user) return error(res, 401, 'User not authorized.');

	User.findById(req.user.id, (err, found) => {
		if (err) return error(res, 500, error);

		if (!secret.length) return error(res, 'Secret is empty.');

		found.secrets.push(secret);
		found.save((err) => {
			if (err) return error(res, 400, 'Unable to save user data.');
			res.status(200).json({ secrets: found.secrets });
		});
	});
});

router.post('/submit', (req, res) => {
	if (!req.user) return error(res, 401, 'User unauthorized');

	const { secret } = req.body;
	if (!secret) return error(res, 400, 'Providing empty secret.');

	User.findById(req.user?.id, (err, foundUser) => {
		if (err) return error(res, 400, err);

		if (foundUser) {
			foundUser.secrets.push(secret);
			foundUser.save((e) => {
				if (e) return error(res, 400, e);
				res.status(200).json({ saved: true });
			});
		} else {
			error(res, 400, "User wasn/'t found while trying to submiting a secret.");
		}
	});
});

module.exports = router;