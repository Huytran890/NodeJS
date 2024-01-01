import { Schema, model } from 'mongoose';

const categorySchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Tên danh mục không được bỏ trống'],
			minLength: [2, 'Tên danh mục phải có tối thiểu 2 ký tự'],
			maxLength: [50, 'Tên danh mục không được vượt quá 50 ký tự'],
		},
		// description: {
		// 	type: String,
		// 	maxLength: [500, 'Mô tả danh mục không được vượt quá 500 ký tự'],
		// },
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

export const CategoryModel = model('categories', categorySchema);
