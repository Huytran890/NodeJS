import { z } from 'zod';

export const checkCreateSizeSchema = z.object({
	body: z.object({
		name: z
			.string({ required_error: 'Không được bỏ trống!' })
			.max(5, 'Tên size quá dài, không được quá 5 ký tự!'),
	}),
});

export const checkPatchSizeSchema = z.object({
	body: z.object({
		name: z
			.string()
			.max(5, 'Tên size quá dài, không được quá 5 ký tự!')
			.optional(),

		isDeleted: z.boolean().optional(),
	}),
});
