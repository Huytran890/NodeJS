import { z } from 'zod';

export const createSchema = z.object({
	body: z.object({
		firstName: z
			.string({ required_error: 'Họ không được bỏ trống!' })
			.max(50, 'Họ được vượt quá 50 ký tự'),

		lastName: z
			.string({ required_error: 'Tên không được bỏ trống!' })
			.max(50, 'Tên được vượt quá 50 ký tự'),

		email: z.string({ required_error: 'Email không được bỏ trống!' }).refine(
			(email) => {
				const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

				return emailRegex.test(email);
			},
			{ message: 'Email không hợp lệ!' }
		),

		phoneNumber: z
			.string({ required_error: 'Số liên lạc không được bỏ trống!' })
			.refine(
				(value) => {
					const phoneRegex =
						/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;

					return phoneRegex.test(value);
				},
				{ message: 'Số điện thoại không hợp lệ!' }
			),

		address: z
			.string({ required_error: 'Địa chỉ không được bỏ trống!' })
			.max(500, 'Địa chỉ không được vượt quá 500 ký tự!'),

		birthday: z.date().optional(),

		password: z
			.string({ required_error: 'Mật khẩu không được bỏ trống!' })
			.min(3, 'Không được ít hơn 3 ký tự!')
			.max(12, 'Không được vượt quá 12 ký tự!'),
	}),
});

export const loginSchema = z.object({
	body: z.object({
		email: z.string({ required_error: 'Email không được bỏ trống!' }).refine(
			(email) => {
				const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

				return emailRegex.test(email);
			},
			{ message: 'Email không hợp lệ!' }
		),

		password: z
			.string({ required_error: 'Mật khẩu không được bỏ trống!' })
			.min(3, 'Không được ít hơn 3 ký tự!')
			.max(12, 'Không được vượt quá 12 ký tự!'),
	}),
});
