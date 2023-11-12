import { z } from 'zod';

export const checkCreateCategorySchema = z.object({
	body: z.object({
		name: z.string({ required_error: 'Không được bỏ trống!' }),
		description: z.string().max(500, 'Mô tả quá dài!').optional(),
	}),
});

export const checkPatchCategorySchema = z.object({
	body: z.object({
		name: z.string().max(50, 'Tên quá dài').optional(),
		isDeleted: z.boolean().optional(),
		description: z.string().max(500, 'Mô tả quá dài!').optional(),
	}),
});
