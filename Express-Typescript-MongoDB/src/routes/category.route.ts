import express from 'express';
import { validateRequest, checkIdSchema } from '../helpers';
import {
	checkCreateCategorySchema,
	checkPatchCategorySchema,
} from '../validations/category.validation';
import {
	getAll,
	create,
	getDetail,
	update,
	deleteFunc,
} from '../controllers/category.controller';

const router = express.Router();

router
	.route('/')
	.get(getAll)
	.post(validateRequest(checkCreateCategorySchema), create);

router
	.route('/:id')
	.get(validateRequest(checkIdSchema), getDetail)
	.patch(
		validateRequest(checkIdSchema),
		validateRequest(checkPatchCategorySchema),
		update
	)
	.delete(validateRequest(checkIdSchema), deleteFunc);

export default router;
