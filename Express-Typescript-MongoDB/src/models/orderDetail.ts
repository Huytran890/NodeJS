import { Schema, model } from 'mongoose';

export const orderDetailSchema = new Schema(
	{
		productId: { type: Schema.Types.ObjectId, ref: 'products', required: true },
		quantity: { type: Number, require: true, min: 0, default: 1 },
		discount: { type: Number, required: true, default: 0 },
		price: { type: Number, required: true, min: 0, default: 0 },
	},
	{
		versionKey: false,
	}
);

// Virtual with Populate
orderDetailSchema.virtual('order_detail', {
	ref: 'products',
	localField: 'productId',
	foreignField: '_id',
	justOne: true,
});

// Virtuals in console.log()
orderDetailSchema.set('toObject', { virtuals: true });
// Virtuals in JSON
orderDetailSchema.set('toJSON', { virtuals: true });

// export const OrderDetailModel = model('order_details', orderDetailSchema);
