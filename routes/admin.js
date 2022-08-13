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
		if (req.body.password === process.env.ADMIN_PASSWORD) {
			Feedback.find((err, found) => {
				if (err) return error(res, 500, err);

				res.status(200).json({ success: true, feedback: found });
			});
		} else res.status(401).json({ error: 'unauthorized' });
	})
	.delete((req, res) => {
		if (req.body.password === process.env.ADMIN_PASSWORD) {
			if (!req.body.index) return error(res, 400, 'Invalid feedback id parameter.');

			Feedback.deleteOne({});
		} else res.status(401).json({ error: 'unauthorized' });
	});
module.exports = router;
