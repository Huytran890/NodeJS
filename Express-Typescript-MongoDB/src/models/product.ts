import { Schema, model } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

const productSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Tên sản phẩm không được để trống.'],
			minLength: [5, 'Tên sản phẩm phải tối thiểu 5 ký tự.'],
			maxLength: [50, 'Tên sản phẩm không được vượt quá 50 ký tự.'],
		},
		images: [
			{
				type: String,
			},
		],
		price: {
			type: Number,
			required: [true, 'Giá không được để trống.'],
			min: [0, 'Giá phải là số dương.'],
			default: 0,
		},
		discount: {
			type: Number,
			min: [0, 'Giảm giá phải là số dương.'],
			max: [100, 'Giảm giá không vượt quá 100%.'],
			default: 0,
		},
		stock: { type: Number, min: [0, 'Tồn kho không thể âm.'], default: 0 },
		description: {
			type: String,
			maxLength: [500, 'Mô tả sản phẩm không được vượt quá 500 ký tự.'],
		},
		// Reference to Category
		categoryId: {
			type: Schema.Types.ObjectId,
			ref: 'categories',
			required: true,
		},
		// Reference to Supplier
		supplierId: {
			type: Schema.Types.ObjectId,
			ref: 'suppliers',
			required: true,
		},
		// Reference to Size
		sizeId: {
			type: Schema.Types.ObjectId,
			ref: 'sizes',
			required: true,
		},
		// Reference to Color
		colorId: {
			type: Schema.Types.ObjectId,
			ref: 'colors',
			required: true,
		},
		promoteTitle: {
			type: String,
		},
		productTag: {
			type: String,
		},
		imageSale: {
			type: String,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{
		versionKey: false,
		timeStamp: true,
	}
);

productSchema.virtual('discountedPrice').get(function () {
	return (this.price * (100 - this.discount)) / 100;
});
// Virtual with Populate
productSchema.virtual('category', {
	ref: 'categories',
	localField: 'categoryId',
	foreignField: '_id',
	justOne: true,
});

productSchema.virtual('supplier', {
	ref: 'suppliers',
	localField: 'supplierId',
	foreignField: '_id',
	justOne: true,
});

productSchema.virtual('size', {
	ref: 'sizes',
	localField: 'sizeId',
	foreignField: '_id',
	justOne: true,
});
productSchema.virtual('color', {
	ref: 'colors',
	localField: 'colorId',
	foreignField: '_id',
	justOne: true,
});

// Config
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });
productSchema.plugin(mongooseLeanVirtuals);

export const ProductModel = model('products', productSchema);
