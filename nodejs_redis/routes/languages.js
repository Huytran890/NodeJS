const express = require('express');
const router = express.Router();
const Language = require('../models/Language');
const authenticated = require('../middlewares/auth.middleware');

router.get('/', authenticated, async (_, res) => {
	const languages = await Language.find({});
	res.status(200).json({ languages });
});

module.exports = router;
