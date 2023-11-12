import { z } from 'zod';
import { ObjectId } from 'mongodb';

export const productSchema = z.object({
	body: z.object({
		name: z
			.string({ required_error: 'Tên không được bỏ trống!' })
			.max(50, 'Tên sản phẩm quá dài!'),

		price: z.number().min(0, 'Giá không thể âm!').optional(),

		discount: z
			.number()
			.min(0, 'Giảm giá không thể âm!')
			.max(75, 'Giảm giá quá lớn!')
			.int()
			.optional(),

		stock: z
			.number()
			.min(0, 'Số lượng không hợp lệ')
			.int()
			// .refine((value) => value !== undefined && value !== null, {
			// 	message: 'Không được bỏ trống!',
			// }),
			.optional(),

		description: z
			.string()
			.max(3000, 'Mô tả quá dài')
			// .refine((value) => value.trim() !== '', {
			// 	message: 'Không được bỏ trống!',
			// }),
			.optional(),

		// isDeleted: yup.boolean().required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
		categoryId: z.string().refine(
			(value) => {
				if (!value) return true;
				return ObjectId.isValid(value);
			},
			{
				message: 'Invalid ObjectID Format!',
			}
		),

		supplierId: z.string().refine(
			(value) => {
				if (!value) return true;
				return ObjectId.isValid(value);
			},
			{
				message: 'Invalid ObjectID Format!',
			}
		),
	}),
});

export const validationQuerySchema = z.object({
	query: z
		.object({
			categoryId: z.string().refine(
				(value) => {
					if (!value) return true;
					return ObjectId.isValid(value);
				},
				{
					message: 'Invalid ObjectID Format!',
				}
			),
			supplierId: z.string().refine(
				(value) => {
					if (!value) return true;
					return ObjectId.isValid(value);
				},
				{
					message: 'Invalid ObjectID Format!',
				}
			),
			priceStart: z
				.number()
				.min(0)
				.refine((value) => value >= 0, {
					message: 'Giá không hợp lệ',
				}),
			priceEnd: z.number().min(0),
			page: z.number().min(1).optional(),
			limit: z.number().min(2).optional(),
			keyword: z.string().optional(),
			stockStart: z.number().min(0).optional(),
			stockEnd: z.number().optional(),
			discountStart: z.number().min(0).max(75).optional(),
			discountEnd: z.number().min(0).max(75).optional(),
		})
		.refine(
			(data) => {
				return data.priceStart < data.priceEnd;
			},
			{
				message: 'End price must be after start price',
				path: ['priceEnd'],
			}
		),
});
