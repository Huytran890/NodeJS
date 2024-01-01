import { Schema, model } from "mongoose";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";

const commentSchema = new Schema(
    {
        commentText: {
            type: String,
            minLength: [2, 'Bình luận phải tối thiểu 2 ký tự.'],
			maxLength: [150, 'Bình luận không được vượt quá 150 ký tự.'],
        },
        rating: {
            type: Number,
        },
        // Reference to Customer
		customerId: {
			type: Schema.Types.ObjectId,
			ref: 'customers',
		},
		// Reference to Product
		productId: {
			type: Schema.Types.ObjectId,
			ref: 'products',
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

commentSchema.virtual('customer', {
	ref: 'customers',
	localField: 'customerId',
	foreignField: '_id',
	justOne: true,
});
commentSchema.virtual('product', {
	ref: 'products',
	localField: 'productId',
	foreignField: '_id',
	justOne: true,
});

// Config
commentSchema.set('toJSON', { virtuals: true });
commentSchema.set('toObject', { virtuals: true });
commentSchema.plugin(mongooseLeanVirtuals);

export const CommentModel = model('comments', commentSchema);