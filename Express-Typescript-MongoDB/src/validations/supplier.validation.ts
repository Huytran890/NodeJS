import { z } from 'zod';

export const supplierSchema = z.object({
	body: z.object({
		name: z
			.string({ required_error: 'Không được bỏ trống!' })
			.max(50, 'Tên quá dài'),

		email: z
			.string({ required_error: 'Không được bỏ trống!' })
			.email()
			.max(50, 'Email quá dài'),

		phoneNumber: z
			.string({ required_error: 'Không được bỏ trống!' })
			.max(50, 'Tên quá dài')
			.regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, 'Số điện thoại sai rồi!'),

		address: z
			.string({ required_error: 'Không được bỏ trống!' })
			.max(300, 'Địa chỉ quá dài!'),
	}),
});

export const supplierPatchSchema = z.object({
	body: z.object({
		name: z.string().max(50, 'Tên quá dài!').optional(),

		email: z.string().email().max(50, 'Email quá dài!').optional(),

		phoneNumber: z
			.string()
			.max(50, 'Tên quá dài!')
			.regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, 'Số điện thoại sai rồi!')
			.optional(),

		address: z.string().max(300, 'Địa chỉ quá dài!').optional(),
	}),
});
