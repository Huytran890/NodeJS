import express from 'express';
import { validateRequest, checkIdSchema } from '../helpers';
import {
	checkCreateCommentSchema,
} from '../validations/comment.validation';
import {
	getAll,
	create,
	search,
	update,
	deleteFunc,
} from '../controllers/comment.controller';

const router = express.Router();

router.route('/').get(getAll).post(validateRequest(checkCreateCommentSchema), create);

router.get('/search', search);

router
	.route('/:id')
	.patch(
		validateRequest(checkIdSchema),
		validateRequest(checkCreateCommentSchema),
		update
	)
	.delete(validateRequest(checkIdSchema), deleteFunc);

export default router;

