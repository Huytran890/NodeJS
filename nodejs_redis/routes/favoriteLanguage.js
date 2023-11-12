const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');
const Language = require('../models/Language');
const authenticated = require('../middlewares/auth.middleware');

router.post('/', async (req, res) => {
	const { languageId } = req.body;
	const userId = req.session.user?._id;

	if (!languageId || !userId) {
		return res.status(400).json({
			message: 'languageId or userId missing',
		});
	}

	const language = await Favorite.findOneAndUpdate(
		{
			user: userId,
		},
		{
			language: languageId,
		},
		{
			upsert: true,
			new: true,
		}
	);
	res.status(200).json({
		language,
	});
});

router.get('/', async (req, res) => {
	const userId = req.session.user?._id;
	if (!userId) {
		return res.status(401).json({
			message: 'Unauthorized',
		});
	}
	const favorite = await Favorite.findOne({
		user: userId,
	}).populate(['language']);

	if (!favorite) {
	}
	res.status(200).json({
		language: favorite?.language || null,
	});
});

router.get('/report', async (req, res) => {
	const languages = await Favorite.aggregate([
		{
			$group: {
				_id: '$language',
				/**
				 * Provide the field name for the count.
				 */
				count: { $sum: 1 },
			},
		},
		{
			$lookup: {
				from: 'languages',
				localField: '_id',
				foreignField: '_id',
				as: 'language',
			},
		},
	]);
	res.status(200).json({
		languages,
	});
});

module.exports = router;
