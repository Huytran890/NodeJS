import express from 'express';
import { validateRequest, checkIdSchema } from '../helpers';
import {
	supplierSchema,
	supplierPatchSchema,
} from '../validations/supplier.validation';
import {
	getAll,
	create,
	search,
	getDetail,
	update,
	deleteFunc,
} from '../controllers/supplier.controller';

const router = express.Router();

router.route('/').get(getAll).post(validateRequest(supplierSchema), create);

router.get('/search', search);

router
	.route('/:id')
	.get(validateRequest(checkIdSchema), getDetail)
	.patch(
		validateRequest(checkIdSchema),
		validateRequest(supplierPatchSchema),
		update
	)
	.delete(validateRequest(checkIdSchema), deleteFunc);

export default router;
