import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { Rating } from '../constants/enum';

export const checkCreateCommentSchema = z.object({
	body: z.object({
		commentText: z.string().max(150, 'Bình luận quá dài, không được vượt quá 150 ký tự!').optional(),

		rating: z.nativeEnum(Rating, {
			errorMap: (error, _ctx) => {
				if (error.code === 'invalid_enum_value') {
					return {
						message:
							'Giá trị không hợp lệ. Làm ơn cung cấp đánh giá hợp lệ!',
					};
				}
				return { message: 'Đánh giá không hợp lệ!' };
			},
		}),

        productId: z.string().refine(
			(value) => {
				if (!value) return true;
				return ObjectId.isValid(value);
			},
			{
				message: 'Invalid ObjectID Format!',
			}
		),
		customerId: z.string().refine(
			(value) => {
				if (!value) return true;
				return ObjectId.isValid(value);
			},
			{
				message: 'Invalid ObjectID Format!',
			}
		),
		isDeleted: z.boolean().optional(),
	}),
});