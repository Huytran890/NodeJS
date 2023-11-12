import { Schema, model } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

const reviewSchema = new Schema(
	{
		comment: {
			type: String,
			maxLength: [50, 'Bình luận không được vượt quá 50 ký tự.'],
		},
		liked: {
			type: Boolean,
			default: false,
		},
		// Reference to User
		categoryId: {
			type: Schema.Types.ObjectId,
			ref: 'users',
			required: true,
		},
		// Reference to Product
		supplierId: {
			type: Schema.Types.ObjectId,
			ref: 'products',
			required: true,
		},
	},
	{
		versionKey: false,
		timeStamp: true,
	}
);

// Virtual with Populate
reviewSchema.virtual('user', {
	ref: 'users',
	localField: 'userId',
	foreignField: '_id',
	justOne: true,
});

reviewSchema.virtual('product', {
	ref: 'products',
	localField: 'productId',
	foreignField: '_id',
	justOne: true,
});

// Config
reviewSchema.set('toJSON', { virtuals: true });
reviewSchema.set('toObject', { virtuals: true });
reviewSchema.plugin(mongooseLeanVirtuals);

export const ReviewModel = model('reviews', reviewSchema);
