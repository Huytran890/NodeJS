import { z } from 'zod';

export const userSchema = z.object({
	body: z.object({
		firstName: z
			.string({ required_error: 'Không được bỏ trống!' })
			.max(50, 'Họ được vượt quá 50 ký tự!'),

		lastName: z
			.string({ required_error: 'Không được bỏ trống!' })
			.max(50, 'Tên được vượt quá 50 ký tự!'),

		email: z
			.string()
			// .email()
			.refine(
				(email) => {
					const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

					return emailRegex.test(email);
				},
				{ message: 'Email không hợp lệ!' }
			),

		phoneNumber: z.string({ required_error: 'Không được bỏ trống!' }).refine(
			(value) => {
				const phoneRegex =
					/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;

				return phoneRegex.test(value);
			},
			{ message: 'Số điện thoại không hợp lệ!' }
		),

		address: z
			.string({ required_error: 'Không được bỏ trống!' })
			.max(500, 'Địa chỉ không được vượt quá 500 ký tự!'),

		birthday: z.coerce.date({ required_error: 'Không được bỏ trống!' }),

		password: z
			.string({ required_error: 'Không được bỏ trống!' })
			.min(3, 'Không được ít hơn 3 ký tự!')
			.max(12, 'Không được vượt quá 12 ký tự!'),
	}),
});

export const userPatchSchema = z.object({
	body: z.object({
		firstName: z.string().max(50, 'Họ được vượt quá 50 ký tự!').optional(),

		lastName: z.string().max(50, 'Tên được vượt quá 50 ký tự!').optional(),

		email: z
			.string()
			// .email()
			.refine(
				(email) => {
					const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

					return emailRegex.test(email);
				},
				{ message: 'Email không hợp lệ!' }
			)
			.optional(),

		phoneNumber: z
			.string()
			.refine(
				(value) => {
					const phoneRegex =
						/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;

					return phoneRegex.test(value);
				},
				{ message: 'Số điện thoại không hợp lệ!' }
			)
			.optional(),

		address: z
			.string()
			.max(500, 'Địa chỉ không được vượt quá 500 ký tự!')
			.optional(),

		birthday: z.coerce.date().optional(),

		password: z
			.string()
			.min(3, 'Không được ít hơn 3 ký tự')
			.max(12, 'Không được vượt quá 12 ký tự')
			.optional(),
	}),
});
