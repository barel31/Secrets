const router = require('express').Router();
// const User = require('../models/users');
const Feedback = require('../models/feedback');

const error = (res, code, err) => {
	console.log(`${Date()}: ${code} - ${err}`);
	res.status(code).json({ error: err });
};

router
	.route('/feedback')
	.post((req, res) => {
		if (!req.user) return error(res, 401, 'User not authenticated.');

		if (req.body.data.password !== process.env.ADMIN_PASSWORD && !req.user?.admin)
			res.status(401).json({ error: 'Incorrect password.' });

		req.user.admin = true;

		Feedback.find((err, found) => {
			if (err) return error(res, 500, err);

			res.status(200).json({ success: true, feedback: found });
		});
	})
	.delete((req, res) => {
		if (!req.user?.admin) return error(res, 401, 'User not authenticated.');

		const { deleteId } = req.body;
		if (!deleteId) return error(res, 400, 'Invalid feedback id parameter.');

		Feedback.deleteOne({ _id: deleteId }, (err) => {
			if (err) return error(res, 500, err);

			res.status(200).json({ success: true });
		});
	});

module.exports = router;
