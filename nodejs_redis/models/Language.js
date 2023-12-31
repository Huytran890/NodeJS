const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			unique: true,
			required: true,
		},
		iconUrl: {
			type: String,
		},
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

module.exports = mongoose.model('Language', languageSchema);
