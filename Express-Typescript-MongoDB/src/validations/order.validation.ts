import { z } from 'zod';
import { ObjectId } from 'mongodb';

export const getSchema = z.object({
	query: z.object({
		category: z.string().refine(
			(value) => {
				if (!value) return true;
				return ObjectId.isValid(value);
			},
			{
				message: "Invalid Category's ObjectID Format!",
			}
		),
		supplier: z.string().refine(
			(value) => {
				if (!value) return true;
				return ObjectId.isValid(value);
			},
			{
				message: "Invalid Supplier's ObjectID Format!",
			}
		),
		productName: z.string().optional(),
		stockStart: z.number().min(0).optional(),
		stockEnd: z.number().optional(),
		priceStart: z.number().min(0).optional(),
		priceEnd: z.number().optional(),
		discountStart: z.number().min(0).optional(),
		discountEnd: z.number().max(50).optional(),
		skip: z.number().optional(),
		limit: z.number().optional(),
	}),
});

export const getDetailSchema = z.object({
	params: z.object({
		id: z.string().refine(
			(value) => {
				if (!value) return true;
				return ObjectId.isValid(value);
			},
			{
				message: "Invalid Order's ObjectID Format!",
			}
		),
	}),
});

export const updateStatusSchema = z.object({
	body: z.object({
		status: z
			.string({
				required_error: 'Trạng thái đơn hàng không được bỏ trống!',
			})
			.refine(
				(value) =>
					[
						'WAITING',
						'COMPLETED',
						'CANCELED',
						'REJECTED',
						'DELIVERING',
					].includes(value),
				{
					message: 'Trạng thái đơn hàng không hợp lệ!',
				}
			),
	}),
});

export const createSchema = z.object({
	body: z
		.object({
			createdDate: z.coerce.date().optional(),

			shippedDate: z.coerce.date().nullable(),

			paymentType: z
				.string({
					required_error:
						'Phương thức thanh toán Không được bỏ trống!',
				})
				.refine((value) => ['CASH', 'CREDIT_CARD'].includes(value), {
					message: 'Phương thức thanh toán không hợp lệ!',
				}),

			status: z
				.string({ required_error: 'Trạng thái Không được bỏ trống!' })
				.refine(
					(value) =>
						['WAITING', 'COMPLETED', 'CANCELED'].includes(value),
					{
						message: 'Trạng thái không hợp lệ!',
					}
				),

			customerId: z.string().refine(
				(value) => {
					if (!value) return true;
					return ObjectId.isValid(value);
				},
				{
					message: "Invalid Customer's ObjectID Format!",
				}
			),

			employeeId: z.string().refine(
				(value) => {
					if (!value) return true;
					return ObjectId.isValid(value);
				},
				{
					message: "Invalid Employee's ObjectID Format!",
				}
			),

			productList: z.array(
				z.object({
					productId: z.string().refine(
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
							required_error: 'Số lượng không được bỏ trống!',
						})
						.min(0, 'Số lượng phải là số nguyên dương!'),

					// price: yup.number().required().min(0),

					// discount: yup.number().required().min(0),
				})
			),
		})
		.refine(
			(data) => {
				if (!data.shippedDate) return true;

				if (
					data.shippedDate &&
					data.createdDate &&
					data.shippedDate < data.createdDate
				) {
					return false;
				}

				if (data.shippedDate < new Date()) {
					return false;
				}

				return true;
			},
			{
				message: 'Ngày giao hàng không hợp lệ!',
				path: ['shippedDate'],
			}
		),
});

export const updateShippingDateSchema = z.object({
	body: z
		.object({
			createdDate: z.coerce.date().optional(),

			shippedDate: z.coerce.date(),
		})
		.refine(
			(data) => {
				if (!data.shippedDate) return true;

				if (
					data.shippedDate &&
					data.createdDate &&
					data.shippedDate < data.createdDate
				) {
					return false;
				}

				if (data.shippedDate < new Date()) {
					return false;
				}

				return true;
			},
			{
				message: 'Ngày giao hàng không hợp lệ!',
				path: ['shippedDate'],
			}
		),
});

export const updateEmployeeSchema = z.object({
	body: z.object({
		userId: z.string().refine(
			(value) => {
				if (!value) return true;
				return ObjectId.isValid(value);
			},
			{
				message: "Invalid Employee's ObjectID Format!",
			}
		),
	}),
});
