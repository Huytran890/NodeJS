import { z } from 'zod';

export const checkCreateColorSchema = z.object({
	body: z.object({
		name: z
			.string({ required_error: 'Không được bỏ trống!' })
			.max(10, 'Tên màu quá dài, không được quá 10 ký tự!'),
		description: z
			.string()
			.max(50, 'Mô tả màu không được vượt quá 50 ký tự!')
			.optional(),
	}),
});

export const checkPatchColorSchema = z.object({
	body: z.object({
		name: z
			.string()
			.max(10, 'Tên màu quá dài, không được quá 10 ký tự!')
			.optional(),
		description: z
			.string()
			.max(50, 'Mô tả màu không được vượt quá 50 ký tự!')
			.optional(),
		isDeleted: z.boolean().optional(),
	}),
});
