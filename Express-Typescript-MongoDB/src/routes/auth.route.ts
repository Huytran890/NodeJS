import express from 'express';
import passport from 'passport';
import { validateRequest } from '../helpers';

import { loginSchema } from '../validations/auth.validation';
import {
	login,
	checkRefreshToken,
	basicLogin,
	getMe,
} from '../controllers/auth.controller';

const router = express.Router();

router
	.route('/login')
	.post(
		validateRequest(loginSchema),
		passport.authenticate('local', { session: false }),
		login
	);

router.route('/refresh-token').post(checkRefreshToken);

router
	.route('/basic')
	.post(passport.authenticate('basic', { session: false }), basicLogin);

router
	.route('/profile')
	.get(passport.authenticate('jwt', { session: false }), getMe);

export default router;
