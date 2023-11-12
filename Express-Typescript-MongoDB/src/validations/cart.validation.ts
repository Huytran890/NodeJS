import { z } from 'zod';
import { ObjectId } from 'mongodb';

// getSchema: yup.object({
//   query: yup.object({
//     category: yup.string().test('Validate ObjectID', '${path} is not valid ObjectID', (value) => {
//       if (!value) return true;
//       return ObjectId.isValid(value);
//     }),
//     sup: yup.string().test('Validate ObjectID', '${path} is not valid ObjectID', (value) => {
//       if (!value) return true;
//       return ObjectId.isValid(value);
//     }),
//     productName: yup.string(),
//     stockStart: yup.number().min(0),
//     stockEnd: yup.number(),
//     priceStart: yup.number().min(0),
//     priceEnd: yup.number(),
//     discountStart: yup.number().min(0),
//     discountEnd: yup.number().max(50),
//     skip: yup.number(),
//     limit: yup.number(),
//   }),
// }),

export const getDetailSchema = z.object({
	params: z.object({
		id: z.string().refine(
			(value) => {
				if (!value) return true;
				return ObjectId.isValid(value);
			},
			{
				message: "Invalid Cart's ObjectID Format!",
			}
		),
	}),
});

export const removeSchema = z.object({
	body: z.object({
		customerId: z.string().refine(
			(value) => {
				if (!value) return true;
				return ObjectId.isValid(value);
			},
			{
				message: "Invalid Cart's ObjectID Format!",
			}
		),
		productId: z.string().refine(
			(value) => {
				if (!value) return true;
				return ObjectId.isValid(value);
			},
			{
				message: "Invalid Product's ObjectID Format!",
			}
		),
	}),
});

export const createSchema = z.object({
	body: z.object({
		customerId: z
			.string({
				required_error: 'Mã khách hàng Không được bỏ trống!',
			})
			.refine(
				(value) => {
					if (!value) return true;
					return ObjectId.isValid(value);
				},
				{
					message: "Invalid Customer's ObjectID Format!",
				}
			),

		productId: z
			.string({
				required_error: 'Mã sản phẩm Không được bỏ trống!',
			})
			.refine(
				(value) => {
					if (!value) return true;
					return ObjectId.isValid(value);
				},
				{
					message: "Invalid Product's ObjectID Format!",
				}
			),

		quantity: z
			.number({
				required_error: 'Số lượng Không được bỏ trống!',
			})
			.min(0),
	}),
});
