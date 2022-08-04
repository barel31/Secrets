const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');

const Session = new Schema({
	refreshToken: {
		type: String,
		default: '',
	},
});

const User = new Schema({
	username: {
		type: String,
		default: '',
	},
	authStrategy: {
		type: String,
		default: 'local',
	},
	secrets: {
		type: [],
		default: 50,
	},
    googleId: String,
    facebookId: String,

	refreshToken: {
		type: [Session],
	},
});

//Remove refreshToken from the response
User.set('toJSON', {
	transform: function (doc, ret, options) {
		delete ret.refreshToken;
		return ret;
	},
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
