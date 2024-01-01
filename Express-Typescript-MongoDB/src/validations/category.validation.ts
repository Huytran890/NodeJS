import { z } from 'zod';

export const checkCreateCategorySchema = z.object({
	body: z.object({
		name: z
			.string({ required_error: 'Không được bỏ trống!' })
			.max(50, 'Tên thể loại quá dài, không được vượt quá 50 ký tự!'),
		// description: z
		// 	.string()
		// 	.max(500, 'Mô tả quá dài, không được vượt quá 500 ký tự!')
		// 	.optional(),
	}),
});

export const checkPatchCategorySchema = z.object({
	body: z.object({
		name: z
			.string()
			.max(50, 'Tên thể loại quá dài, không được vượt quá 50 ký tự!')
			.optional(),
		isDeleted: z.boolean().optional(),
		// description: z
		// 	.string()
		// 	.max(500, 'Mô tả thể loại quá dài, không được vượt quá 500 ký tự!')
		// 	.optional(),
	}),
});
