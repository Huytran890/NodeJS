import { z } from 'zod';
import { UserRole } from '../constants/enum';

export const userSchema = z.object({
	body: z.object({
		firstName: z
			.string({ required_error: 'Không được bỏ trống!' })
			.max(50, 'Họ được vượt quá 50 ký tự!'),

		lastName: z
			.string({ required_error: 'Không được bỏ trống!' })
			.max(50, 'Tên được vượt quá 50 ký tự!'),

		email: z
			.string({ required_error: 'Không được bỏ trống!' })
			.max(30, 'Email không được vượt quá 30 ký tự!')
			// .email()
			.refine(
				(email) => {
					const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

					return emailRegex.test(email);
				},
				{ message: 'Email không hợp lệ!' }
			),

		phoneNumber: z
			.string({ required_error: 'Không được bỏ trống!' })
			.max(30, 'Số điện thoại không được vượt quá 30 ký tự.')
			.refine(
				(value) => {
					const phoneRegex =
						/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;

					return phoneRegex.test(value);
				},
				{ message: 'Số điện thoại không hợp lệ!' }
			),

		address: z
			.string({ required_error: 'Không được bỏ trống!' })
			.max(300, 'Địa chỉ không được vượt quá 500 ký tự!'),

		birthday: z.coerce.date({ required_error: 'Không được bỏ trống!' }),

		password: z
			.string({ required_error: 'Không được bỏ trống!' })
			.min(3, 'Không được ít hơn 3 ký tự!')
			.max(15, 'Không được vượt quá 15 ký tự!'),
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
			.max(300, 'Địa chỉ không được vượt quá 300 ký tự!')
			.optional(),

		birthday: z.coerce.date().optional(),

		role: z.nativeEnum(UserRole, {
			errorMap: (error, _ctx) => {
				if (error.code === 'invalid_enum_value') {
					return {
						message:
							'Giá trị không hợp lệ. Làm ơn cung cấp giá trị role hợp lệ!',
					};
				}
				return { message: 'Role không hợp lệ!' };
			},
		}),

		password: z
			.string()
			.min(3, 'Password không được ít hơn 3 ký tự')
			.max(15, 'Password không được vượt quá 15 ký tự')
			.optional(),

		isDeleted: z.boolean().optional(),
	}),
});
