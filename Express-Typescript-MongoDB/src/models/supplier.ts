import { Schema, model } from 'mongoose';

const supplierSchema = new Schema(
	{
		name: {
			type: String,
			require: true,
			minLength: [2, 'Tên nhà cung cấp phải có tối thiểu 2 ký tự.'],
			maxLength: [100, 'Tên nhà cung cấp không được vượt quá 100 ký tự.'],
		},

		email: {
			type: String,
			validate: {
				validator: function (value: string) {
					const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
					return emailRegex.test(value);
				},
				message: `{VALUE} không phải là email hợp lệ!`,
				// message: (props) => `{props.value} is not a valid email!`,
			},
			required: [true, 'Email không được bỏ trống.'],
			unique: true,
		},
		phoneNumber: {
			type: String,
			validate: {
				validator: function (value: string) {
					const phoneRegex =
						/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
					return phoneRegex.test(value);
				},
				message: `{VALUE} không phải là số điện thoại hợp lệ!`,
				// message: (props) => `{props.value} is not a valid email!`,
			},
			required: [true, 'Số liên lạc không được bỏ trống.'],
			unique: true,
		},

		address: {
			type: String,
			minLength: [5, 'Địa chỉ phải tối thiểu 5 ký tự.'],
			maxLength: [500, 'Địa chỉ không được vượt quá 500 ký tự.'],
			required: [true, 'Địa chỉ không được bỏ trống.'],
		},
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

export const SupplierModel = model('suppliers', supplierSchema);
