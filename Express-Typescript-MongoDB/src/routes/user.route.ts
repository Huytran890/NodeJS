import express from 'express';
import { validateRequest, checkIdSchema } from '../helpers';
import { userSchema, userPatchSchema } from '../validations/user.validation';
import {
	getAll,
	create,
	search,
	getDetail,
	update,
	deleteFunc,
} from '../controllers/user.controller';

const router = express.Router();

router.route('/').get(getAll).post(validateRequest(userSchema), create);

router.get('/search', search);

router
	.route('/:id')
	.get(validateRequest(checkIdSchema), getDetail)
	.patch(
		validateRequest(checkIdSchema),
		validateRequest(userPatchSchema),
		update
	)
	.delete(validateRequest(checkIdSchema), deleteFunc);

export default router;
