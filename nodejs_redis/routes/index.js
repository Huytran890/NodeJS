const express = require('express');
const router = express.Router();
const path = require('path');

const publicRootConfig = {
	root: path.join(__dirname, '../public'),
};

router.get('/', function (req, res) {
	const session = req.session;
	if (session.user) {
		res.sendFile('index.html', publicRootConfig);
	} else {
		res.sendFile('login.html', publicRootConfig);
	}
});

router.get('/login', (req, res) => {
	if (req.session.user) {
		return res.redirect('/');
	}
	res.sendFile('login.html', publicRootConfig);
});
router.get('/register', (req, res) => {
	if (req.session.user) {
		return res.redirect('/');
	}
	res.sendFile('register.html', publicRootConfig);
});

module.exports = router;
