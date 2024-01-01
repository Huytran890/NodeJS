import express from 'express';
import { validateRequest, checkIdSchema } from '../helpers';
import {
	checkCreateSizeSchema,
	checkPatchSizeSchema,
} from '../validations/size.validation';
import {
	getAll,
	create,
	search,
	getDetail,
	update,
	deleteFunc,
} from '../controllers/size.controller';

const router = express.Router();

router.route('/').get(getAll).post(validateRequest(checkCreateSizeSchema), create);

router.get('/search', search);

router
	.route('/:id')
	.get(validateRequest(checkIdSchema), getDetail)
	.patch(
		validateRequest(checkIdSchema),
		validateRequest(checkPatchSizeSchema),
		update
	)
	.delete(validateRequest(checkIdSchema), deleteFunc);

export default router;