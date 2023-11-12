const express = require('express');
const User = require('../models/User');
const authenticated = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/register', async (req, res) => {
	const { username, password } = req.body;
	const existingUser = await User.findOne({
		username,
	});

	if (existingUser) {
		return res.status(400).json({
			message: 'User already exists!',
		});
	}

	try {
		const newUser = new User({
			username,
			password,
		});

		await newUser.save();
		const payload = newUser.toJSON();
		req.session.user = newUser;
		delete payload.password;

		res.status(200).json({
			message: 'Register successfully.',
			payload,
		});
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		res.status(400).json({
			message: 'Register failed!',
		});
	}
});

router.post('/login', async (req, res) => {
	const { username, password } = req.body;
	const existingUser = await User.findOne({
		username,
	});

	if (!existingUser) {
		return res.status(400).json({
			message: 'User does not exists!',
		});
	} else if (!existingUser.comparePassword(password)) {
		return res.status(400).json({
			message: 'Password is incorrect!',
		});
	}

	req.session.user = existingUser;
	const payload = existingUser.toJSON();
	delete payload.password;

	res.status(200).json({
		message: 'Login successfully.',
		payload,
	});
});

router.get('/logout', async (req, res) => {
	req.session.destroy((error) => {
		if (error) {
			return res.status(400).json({
				message: error.message,
			});
		}
		res.redirect('/login');
	});
});

router.get('/me', authenticated, async (req, res) => {
	const { username } = req.session.user;
	const user = await User.findOne({ username }, { password: 0 });
	res.status(200).json({
		payload: user,
	});
});

module.exports = router;
