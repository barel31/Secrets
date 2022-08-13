const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true }, (err) => {
	if (err) console.log(`${Date()}: ${err}`);
	else console.log(Date() + ': Connected to database server successfully.');
});

const feedbackSchema = new mongoose.Schema({
	name: { first: String, last: String },
	range: Number,
	comments: String,
	date: { type: Date, default: Date.now },
});

const Feedback = new mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
