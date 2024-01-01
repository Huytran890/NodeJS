import { Schema, model } from "mongoose";

const sizeSchema = new Schema(
    {
        name: {
            type: String,
            require: [true, 'Tên size không được bỏ trống'],
            minLength: [1, 'Tên size phải có tối thiểu 1 ký tự'],
			maxLength: [5, 'Tên size không được vượt quá 5 ký tự'],
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

export const SizeModel = model('sizes', sizeSchema);