import { z } from 'zod';
import { ObjectId } from 'mongodb';

export const productSchema = z.object({
	body: z.object({
		name: z
			.string({ required_error: 'Tên sản phẩm không được bỏ trống!' })
			.max(50, 'Tên sản phẩm quá dài, không được vượt quá 50 ký tự!'),

		price: z
			.number({ required_error: 'Giá sản phẩm không được bỏ trống!' })
			.min(0, 'Giá không thể âm!'),

		images: z
			.array(z.string())
			.refine((value) => value.length > 0, {
				message: 'Không được bỏ trống!',
			}),

		discount: z
			.number()
			.min(0, 'Giảm giá không thể âm!')
			.max(100, 'Giảm giá quá lớn, không được vượt quá 100%.')
			.int('Giảm giá phải là số nguyên dương.')
			.optional(),

		stock: z
			.number()
			.min(0, 'Số lượng tồn kho không thể âm!')
			.int()
			// .refine((value) => value !== undefined && value !== null, {
			// 	message: 'Không được bỏ trống!',
			// }),
			.optional(),

		description: z
			.string()
			.max(500, 'Mô tả sản phẩm quá dài, không được vượt quá 500 ký tự!')
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
		sizeId: z.string().refine(
			(value) => {
				if (!value) return true;
				return ObjectId.isValid(value);
			},
			{
				message: 'Invalid ObjectID Format!',
			}
		),
		colorId: z.string().refine(
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
			sizeId: z.string().refine(
				(value) => {
					if (!value) return true;
					return ObjectId.isValid(value);
				},
				{
					message: 'Invalid ObjectID Format!',
				}
			),
			colorId: z.string().refine(
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
					message: 'Giá đầu vào không hợp lệ!',
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
				message: 'Giá bán phải lớn hơn giá đầu vào!',
				path: ['priceEnd'],
			}
		),
});
