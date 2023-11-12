import express from 'express';
import { validateRequest, checkIdSchema } from '../helpers';
import {
	getDetailSchema,
	createSchema,
	updateEmployeeSchema,
	updateShippingDateSchema,
	updateStatusSchema,
} from '../validations/order.validation';
import {
	getAll,
	getDetail,
	create,
	updateStatus,
	updateEmployee,
	updateShippingDate,
} from '../controllers/order.controller';

const router = express.Router();

router.route('/').get(getAll).post(validateRequest(createSchema), create);

router.route('/:id').get(validateRequest(getDetailSchema), getDetail);

router
	.route('/status/:id')
	.patch(validateRequest(updateStatusSchema), updateStatus);

router
	.route('/shipping/:id')
	.patch(validateRequest(updateShippingDateSchema), updateShippingDate);

router
	.route('/employee/:id')
	.patch(validateRequest(updateEmployeeSchema), updateEmployee);

export default router;
