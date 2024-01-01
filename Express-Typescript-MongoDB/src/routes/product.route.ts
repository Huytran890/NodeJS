import express from 'express';
import { validateRequest, checkIdSchema, upload } from '../helpers';
import {
	productSchema,
	validationQuerySchema,
} from '../validations/product.validation';
import {
	getAll,
	getList,
	create,
	search,
	getDetail,
	update,
	deleteFunc,
} from '../controllers/product.controller';

const router = express.Router();

router
	.route('/')
	.get(getAll)
	.post(validateRequest(productSchema), upload.array('images', 10), create);

router.route('/list').get(getList);

router.get('/search', validateRequest(validationQuerySchema), search);

router
	.route('/:id')
	.get(validateRequest(checkIdSchema), getDetail)
	.patch(
		validateRequest(checkIdSchema),
		validateRequest(productSchema),
		update
	)
	.delete(validateRequest(checkIdSchema), deleteFunc);

export default router;
