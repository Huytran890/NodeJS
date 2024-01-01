import { z } from 'zod';

export const supplierSchema = z.object({
	body: z.object({
		name: z
			.string({ required_error: 'Không được bỏ trống!' })
			.min(2, 'Tên nhà cung cấp phải có tối thiểu 2 ký tự!')
			.max(
				100,
				'Tên nhà cung cấp quá dài, không được vượt quá 100 ký tự!'
			),

		email: z
			.string({ required_error: 'Không được bỏ trống!' })
			.email('Email không hợp lệ!')
			.max(30, 'Email quá dài, không được vượt quá 30 ký tự.'),

		phoneNumber: z
			.string({ required_error: 'Không được bỏ trống!' })
			.max(30, 'Số điện thoại quá dài, không được vượt quá 30 ký tự.')
			.regex(
				/(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
				'Số điện thoại không hợp lệ!'
			),

		address: z
			.string({ required_error: 'Không được bỏ trống!' })
			.min(5, 'Địa chỉ phải tối thiểu 5 ký tự.')
			.max(500, 'Địa chỉ quá dài, không được vượt quá 500 ký tự!'),
	}),
});

export const supplierPatchSchema = z.object({
	body: z.object({
		name: z
			.string()
			.max(100, 'Tên quá dài, không được vượt quá 100 ký tự!')
			.optional(),

		email: z
			.string()
			.max(30, 'Email quá dài, không được vượt quá 30 ký tự!')
			.email('Email không hợp lệ!')
			.optional(),

		phoneNumber: z
			.string()
			.max(30, 'Số điện thoại quá dài, không được vượt quá 30 ký tự!')
			.regex(
				/(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
				'Số điện thoại không hợp lệ!'
			)
			.optional(),

		address: z
			.string()
			.max(500, 'Địa chỉ quá dài, không được vượt quá 500 ký tự!')
			.optional(),

		isDeleted: z.boolean().optional(),
	}),
});
