const mongoose = require('mongoose');
const { MONGODB_URL, DB_NAME } = require('./constants/db');

module.exports = () => {
	return mongoose.connect(`${MONGODB_URL}${DB_NAME}`).catch((e) => {
		console.log('««««« Could not connect to MongoDB »»»»»', e);
	});
};
