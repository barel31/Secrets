const mongoose = require('mongoose');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true }, (err) => {
	if (err) console.log(`${Date()}: ${err}`);
	else console.log(Date() + ': Connected to database server successfully.');
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

module.exports = User;
