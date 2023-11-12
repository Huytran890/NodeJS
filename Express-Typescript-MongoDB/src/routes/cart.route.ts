import express from 'express';
import { validateRequest } from '../helpers';
import {
	getDetailSchema,
	removeSchema,
	createSchema,
} from '../validations/cart.validation';

import { getDetail, create, remove } from '../controllers/cart.controller';

const router = express.Router();

router
	.route('/')
	.post(validateRequest(createSchema), create)
	.delete(validateRequest(removeSchema), remove);

router
	.route('/:id') // xem chi tiết giỏ hàng
	.get(validateRequest(getDetailSchema), getDetail);

export default router;
