import { Schema, model } from 'mongoose';
import { UserRole } from '../constants/enum';

const cartDetailSchema = new Schema(
	{
		productId: { type: Schema.Types.ObjectId, ref: 'products', required: true },
		quantity: { type: Number, require: true, min: 0 },
	},
	{
		versionKey: false,
	}
);

// Virtual with Populate
cartDetailSchema.virtual('product', {
	ref: 'products',
	localField: 'productId',
	foreignField: '_id',
	justOne: true,
});

// Virtuals in console.log()
cartDetailSchema.set('toObject', { virtuals: true });
// Virtuals in JSON
cartDetailSchema.set('toJSON', { virtuals: true });
// ------------------------------------------------------------------------------------------------

const cartSchema = new Schema(
	{
		customerId: {
			type: Schema.Types.ObjectId,
			ref: 'users',
			required: true,
		},

		// Array
		products: [cartDetailSchema],
	},
	{
		versionKey: false,
	}
);

// Virtual with Populate
cartSchema.virtual('customer', {
	ref: 'users',
	localField: 'customerId',
	foreignField: '_id',
	justOne: true,
	options: { match: { role: UserRole.CUSTOMER } },
});

// Virtuals in console.log()
cartSchema.set('toObject', { virtuals: true });
// Virtuals in JSON
cartSchema.set('toJSON', { virtuals: true });

export const CartModel = model('carts', cartSchema);
