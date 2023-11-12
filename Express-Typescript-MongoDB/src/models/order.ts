import { Schema, model } from 'mongoose';
import { UserRole } from '../constants/enum';
import { orderDetailSchema } from './orderDetail';

const orderSchema = new Schema(
	{
		createdDate: {
			type: Date,
			required: true,
			default: Date.now,
		},

		shippedDate: {
			type: Date,
			validate: {
				validator: function (value: Date) {
					if (!value) return true;

					if (value < (this as any).createdDate) {
						return false;
					}

					return true;
				},
				message: `Shipped date: {VALUE} is invalid!`,
			},
		},

		paymentType: {
			type: String,
			required: true,
			default: 'CASH',
			enum: ['CASH', 'CREDIT_CARD'],
			validate: {
				validator: (value: string) => {
					if (['CASH', 'CREDIT_CARD'].includes(value.toUpperCase())) {
						return true;
					}
					return false;
				},
				message: `Payment type: {VALUE} is invalid!`,
			},
		},

		status: {
			type: String,
			required: true,
			enum: ['WAITING', 'COMPLETED', 'CANCELED', 'REJECTED', 'DELIVERING'],
			default: 'WAITING',
			validate: {
				validator: (value: string) => {
					if (['WAITING', 'COMPLETED', 'CANCELED'].includes(value)) {
						return true;
					}
					return false;
				},
				message: `Status: {VALUE} is invalid!`,
			},
		},
		customerId: {
			type: Schema.Types.ObjectId,
			ref: 'users',
			required: true,
		},
		employeeId: {
			type: Schema.Types.ObjectId,
			ref: 'users',
		},

		// Array
		productList: [orderDetailSchema],
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

// Virtual with Populate
orderSchema.virtual('customer', {
	ref: 'users',
	localField: 'customerId',
	foreignField: '_id',
	justOne: true,
	options: { match: { role: UserRole.CUSTOMER } },
});

orderSchema.virtual('employee', {
	ref: 'users',
	localField: 'employeeId',
	foreignField: '_id',
	justOne: true,
	options: { match: { role: UserRole.EMPLOYEE } },
});

// Virtuals in console.log()
orderSchema.set('toObject', { virtuals: true });
// Virtuals in JSON
orderSchema.set('toJSON', { virtuals: true });

export const OrderModel = model('orders', orderSchema);
