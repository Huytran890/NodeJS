import { UserRole } from '../constants/enum';
import { Schema, model } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import bcrypt from 'bcryptjs';

// export interface IUser {
// 	firstName: String;
// 	lastName: string;
// 	phoneNumber: string;
// 	address: string;
// 	email: string;
// 	birthday?: Date;
// 	password: string;
// 	role: {
// 		name: String;
// 	};
// 	isDeleted: boolean;
// }
// export interface IUserModel extends IUser, Document {}
const userSchema = new Schema(
	{
		firstName: {
			type: String,
			required: [true, 'Tên không được bỏ trống.'],
			minLength: [3, 'Tên phải có tối thiểu 3 ký tự.'],
			maxLength: [50, 'Tên không được vượt quá 50 ký tự.'],
		},
		lastName: {
			type: String,
			required: [true, 'Họ tên không được bỏ trống.'],
			minLength: [2, 'Họ phải có tối thiểu 2 ký tự.'],
			maxLength: [50, 'Họ không được vượt quá 30 ký tự.'],
		},
		phoneNumber: {
			type: String,
			required: [true, 'Số điện thoại không được bỏ trống.'],
			maxLength: [30, 'Số điện thoại không được vượt quá 30 ký tự.'],
			validate: {
				validator: function (value: string) {
					const phoneRegex =
						/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
					return phoneRegex.test(value);
				},
				message: `Số điện thoại {VALUE} không hợp lệ!`,
				// message: (props) => `{props.value} is not a valid email!`,
			},
		},
		address: {
			type: String,
			required: [true, 'Địa chỉ không được bỏ trống.'],
			minLength: [5, 'Địa chỉ phải có tối thiểu 5 ký tự.'],
			maxLength: [300, 'Địa chỉ không được vượt quá 300 ký tự.'],
			unique: [true, 'Địa chỉ không được trùng!'],
		},
		email: {
			type: String,
			validate: {
				validator: function (value: string) {
					const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
					return emailRegex.test(value);
				},
				message: `{VALUE} is not a valid email!`,
				// message: (props) => `{props.value} is not a valid email!`,
			},
			required: [true, 'Email không được bỏ trống.'],
			minLength: [5, 'Email phải có tối thiểu 5 ký tự.'],
			maxLength: [30, 'Email không được vượt quá 30 ký tự.'],
			unique: [true, 'Email không được trùng!'],
		},
		birthday: { type: Date },
		password: {
			type: String,
			required: true,
			minLength: [3, 'Không được ít hơn 3 ký tự.'],
			maxLength: [15, 'Không được vượt quá 15 ký tự.'],
		},
		role: {
			type: String,
			default: UserRole.CUSTOMER,
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

userSchema
	.virtual('fullName')
	.get(function (this: { firstName: string; lastName: string }) {
		return `${this.firstName} ${this.lastName}`;
	});

userSchema.pre('save', async function (next) {
	try {
		// generate salt key
		const salt = await bcrypt.genSalt(10); // 10 ký tự ABCDEFGHIK + 123456
		// generate password = salt key + hash key
		const hashPass = await bcrypt.hash(this.password, salt);
		// override password
		this.password = hashPass;
		next();
	} catch (error: any) {
		next(error);
	}
});

// isValidPass => custom
userSchema.methods.isValidPassword = async function (password: string) {
	try {
		return await bcrypt.compare(password, this.password);
	} catch (err: any) {
		throw new Error(err);
	}
};

// Config
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });
userSchema.plugin(mongooseLeanVirtuals);

export const UserModel = model('users', userSchema);
