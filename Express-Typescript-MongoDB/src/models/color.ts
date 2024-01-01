import { Schema, model } from "mongoose";

const colorSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Tên danh mục không được bỏ trống'],
			minLength: [3, 'Tên màu phải có tối thiểu 3 ký tự'],
			maxLength: [10, 'Tên màu không được vượt quá 10 ký tự'],
        },
        description: {
            type: String,
            maxLength: [50, 'Mô tả màu không được vượt quá 50 ký tự'],
        },
        isDeleted: {
            type: Boolean,
            default: false,
        }
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

export const ColorModel = model('colors', colorSchema);