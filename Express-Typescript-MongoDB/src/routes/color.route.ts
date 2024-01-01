import express from 'express';
import { validateRequest, checkIdSchema } from '../helpers';
import {
	checkCreateColorSchema,
	checkPatchColorSchema,
} from '../validations/color.validation';
import {
	getAll,
	create,
	search,
	getDetail,
	update,
	deleteFunc,
} from '../controllers/color.controller';

const router = express.Router();

router.route('/').get(getAll).post(validateRequest(checkCreateColorSchema), create);

router.get('/search', search);

router
	.route('/:id')
	.get(validateRequest(checkIdSchema), getDetail)
	.patch(
		validateRequest(checkIdSchema),
		validateRequest(checkPatchColorSchema),
		update
	)
	.delete(validateRequest(checkIdSchema), deleteFunc);

export default router;
