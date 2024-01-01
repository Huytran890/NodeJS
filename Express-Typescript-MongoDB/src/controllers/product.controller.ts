import { Request, Response, NextFunction } from 'express';
import { fuzzySearch } from '../helpers';
import { ProductModel } from './../models/product';
import { SupplierModel } from '../models/supplier';
import { CategoryModel } from '../models/category';
import { ColorModel } from '../models/color';
import { SizeModel } from '../models/size';

import cloudinary from '../constants/cloudinary';

const getAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let payload = await ProductModel.aggregate()
			.match({ isDeleted: false })
			.lookup({
				from: 'categories',
				localField: 'categoryId',
				foreignField: '_id',
				as: 'Category',
			})
			.unwind('Category')
			.lookup({
				from: 'suppliers',
				localField: 'supplierId',
				foreignField: '_id',
				as: 'Supplier',
			})
			.unwind('Supplier')
			.project({
				images: 0,
				categoryId: 0,
				supplierId: 0,
			});

		return res.status(200).json({
			payload,
			message: 'Lấy danh sách sản phẩm thành công.',
		});
	} catch (err) {
		console.log('<<== 🚀 err ==>>', err);
		return res.status(404).json({
			message: 'Không tìm thấy!',
			err,
		});
	}
};

type TGetList = Request & {
	query: {
		page?: number;
		pageSize?: number;
	};
};

const getList = async (req: TGetList, res: Response, next: NextFunction) => {
	// NOTE
	try {
		const { page, pageSize } = req.query; // 10 - 1
		const limit = pageSize || 10; // 10
		const skip = page !== undefined ? limit * (page - 1) : 0;

		const conditionFind = { isDeleted: false };

		let payload = await ProductModel.find(conditionFind)
			.populate('color')
			.populate('size')
			.populate('category')
			.populate('supplier')
			.skip(skip)
			.limit(limit)
			.sort({ name: 1, price: 1, discount: -1 })
			.lean();

		const total = await ProductModel.countDocuments(conditionFind);

		return res.status(200).json({
			message: 'Lấy danh sách sản phẩm thành công.',
			total,
			count: payload.length,
			payload,
		});
	} catch (err) {
		console.log('<<== 🚀 err ==>>', err);
		return res.status(404).json({
			message: 'Không tìm thấy!',
			err,
		});
	}
};

type TConditionFind = {
	name?: RegExp;
	colorId?: string;
	sizeId?: string;
	categoryId?: string;
	supplierId?: string;
	isDeleted?: boolean;
	price?: number;
	$expr?: any;
};

const search = async (req: TGetList, res: Response, next: NextFunction) => {
	try {
		const {
			keyword,
			colorId,
			sizeId,
			categoryId,
			supplierId,
			priceStart,
			priceEnd,
			page,
			pageSize,
			stockStart,
			stockEnd,
			discountStart,
			discountEnd,
		} = req.query;
		const limit = pageSize || 12; // 10
		const skip = page !== undefined ? limit * (page - 1) : 0;

		const conditionFind: TConditionFind = { isDeleted: false };

		if (typeof keyword === 'string')
			conditionFind.name = fuzzySearch(keyword);

		if (typeof categoryId === 'string') {
			conditionFind.categoryId = categoryId;
			// conditionFind.$expr = { $eq: ['$categoryId', categoryId] };
		}

		if (typeof supplierId === 'string') {
			conditionFind.supplierId = supplierId;
		}

		if (typeof colorId === 'string') {
			conditionFind.colorId = colorId;
		}

		if (typeof sizeId === 'string') {
			conditionFind.sizeId = sizeId;
		}

		if (priceStart && priceEnd) {
			conditionFind.$expr = {
				$and: [
					{ $lte: ['$price', parseFloat(priceEnd as any)] },
					{ $gte: ['$price', parseFloat(priceStart as any)] },
				],
			};
		} else if (priceStart) {
			(conditionFind.price as any) = {
				$gte: parseFloat(priceStart as any),
			};
		} else if (priceEnd) {
			// Only priceEnd is provided
			(conditionFind.price as any) = {
				$lte: parseFloat(priceEnd as any),
			};
		}

		const payload = await ProductModel.find(conditionFind)
			.populate('color')
			.populate('size')
			.populate('category')
			.populate('supplier')
			.skip(skip)
			.limit(limit);

		const total = await ProductModel.countDocuments(conditionFind);

		res.status(200).json({
			message: 'Lấy danh sách sản phẩm thành công.',
			payload,
			total,
		});
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		return res.status(404).json({
			message: 'Không tìm thấy!',
		});
	}
};

const getDetail = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;

		let payload = await ProductModel.findOne({
			_id: id,
			isDeleted: false,
		})
			.populate('color')
			.populate('size')
			.populate('category')
			.populate('supplier')
			.select('-images -id');

		if (!payload) {
			return res.status(404).json({ message: 'Không tìm thấy!' });
		}

		return res.send({
			code: 200,
			payload,
			message: 'Lấy sản phẩm thành công.',
		});
	} catch (err) {
		console.log('<<== 🚀 err ==>>', err);
		res.status(404).json({
			message: 'Lấy sản phẩm thất bại!',
			payload: err,
		});
	}
};

const create = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const {
			name,
			images,
			price,
			discount,
			stock,
			description,
			colorId,
			sizeId,
			supplierId,
			categoryId,
		} = req.body;

		const getColor = ColorModel.findOne({
			_id: colorId,
			isDeleted: false,
		});
		const getSize = SizeModel.findOne({
			_id: sizeId,
			isDeleted: false,
		});
		const getSupplier = SupplierModel.findOne({
			_id: supplierId,
			isDeleted: false,
		});
		const getCategory = CategoryModel.findOne({
			_id: categoryId,
			isDeleted: false,
		});

		const [existColor, existSize, existSupplier, existCategory] =
			await Promise.all([getColor, getSize, getSupplier, getCategory]);

		const error = [];
		if (!existColor) error.push('Mã màu không khả dụng.');
		if (existColor?.isDeleted) error.push('Mã màu đã bị xóa.');
		if (!existSize) error.push('Bảng size không khả dụng.');
		if (existSize?.isDeleted) error.push('Bảng size đã bị xóa.');
		if (!existSupplier) error.push('Nhà cung cấp không khả dụng.');
		if (existSupplier?.isDeleted) error.push('Nhà cung cấp đã bị xóa.');
		if (!existCategory) error.push('Danh mục không khả dụng.');
		if (existCategory?.isDeleted) error.push('Danh mục đã bị xóa.');

		if (error.length > 0) {
			return res.status(400).json({
				error,
				message: 'Không khả dụng!',
			});
		}

		const uploadedImages = [];

		for (const image of images) {
			try {
				const result = await cloudinary.uploader.upload(image, {
					upload_preset: 'ecommerce_upload',
					public_id: `${name}_images_${Date.now()}`,
					allowed_formats: [
						'png',
						'jpg',
						'jpeg',
						'svg',
						'ico',
						'jfif',
						'webp',
					],
				});

				uploadedImages.push(result);
			} catch (error) {
				console.log('<<== 🚀 error ==>>', error);
			}
		}
		const imagesURL = uploadedImages.map((image) => image.secure_url);

		const newRecord = new ProductModel({
			name,
			images: imagesURL,
			price,
			discount,
			stock,
			description,
			colorId,
			sizeId,
			supplierId,
			categoryId,
		});

		const payload = await newRecord.save();

		return res.status(200).json({
			payload,
			message: 'Tạo mới sản phẩm thành công.',
		});
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		return res.status(404).json({
			message: 'Tạo mới sảm phẩm gặp lỗi!',
			error,
		});
	}
};

const update = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const {
			name,
			price,
			discount,
			stock,
			description,
			colorId,
			sizeId,
			supplierId,
			categoryId,
		} = req.body;

		// Check if the product exists and is not deleted
		const product = await ProductModel.findOne({
			_id: id,
			isDeleted: false,
		});

		if (!product) {
			return res
				.status(404)
				.json({ message: 'Không tìm thấy sản phẩm!' });
		}
		const error = [];

		// Check if the color exists and is not deleted
		if (product.colorId.toString() !== colorId.toString()) {
			const color = await ColorModel.findOne({
				_id: colorId,
				isDeleted: false,
			});

			if (!color) error.push('Mã màu không khả dụng!');
		}
		// Check if the supplier exists and is not deleted
		if (product.sizeId.toString() !== sizeId.toString()) {
			const size = await SizeModel.findOne({
				_id: sizeId,
				isDeleted: false,
			});

			if (!size) error.push('Bảng size không khả dụng!');
		}
		// Check if the supplier exists and is not deleted
		if (product.supplierId.toString() !== supplierId.toString()) {
			const supplier = await SupplierModel.findOne({
				_id: supplierId,
				isDeleted: false,
			});

			if (!supplier) error.push('Nhà cung cấp không khả dụng!');
		}

		// Check if the category exists and is not deleted
		if (product.categoryId.toString() !== categoryId) {
			const category = await CategoryModel.findOne({
				_id: categoryId,
				isDeleted: false,
			});

			if (!category) error.push('Danh mục không khả dụng!');
		}

		if (error.length > 0) {
			return res.status(400).json({
				message: 'Không khả dụng!',
				error,
			});
		}

		// Update the product
		const updatedProduct = await ProductModel.findByIdAndUpdate(
			id,
			{
				name,
				price,
				discount,
				stock,
				description,
				colorId,
				sizeId,
				supplierId,
				categoryId,
			},
			{ new: true }
		);

		if (updatedProduct) {
			return res.status(200).json({
				message: 'Chỉnh sửa sản phẩm thành công.',
				payload: updatedProduct,
			});
		}

		return res
			.status(400)
			.json({ message: 'Chỉnh sửa sản phẩm thất bại!' });
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		return res.status(404).json({
			message: 'Quá trình chỉnh sửa gặp lỗi!',
			error,
		});
	}
};

const deleteFunc = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;

		const result = await ProductModel.findByIdAndUpdate(
			id,
			{ isDeleted: true },
			{ new: true }
		);

		if (result) {
			return res.status(200).json({
				message: 'Xóa sản phẩm thành công.',
				payload: result,
			});
		}

		return res.status(400).json({
			message: 'Xóa sản phẩm thất bại!',
		});
	} catch (error) {
		return res.status(404).json({
			message: 'Không tìm thấy!',
			error,
		});
	}
};

export { getAll, getList, create, search, getDetail, update, deleteFunc };

// const fake = async (req: Request, res: Response, next: NextFunction) => {
// 	try {
// 		const { products } = req.body;

// 		const getSupplier = SupplierModel.findOne({
// 			isDeleted: false,
// 		});
// 		const getCategory = CategoryModel.findOne({
// 			isDeleted: false,
// 		});

// 		const [existSupplier, existCategory] = await Promise.all([
// 			getSupplier,
// 			getCategory,
// 		]);

// 		const data = products.map((item) => ({
// 			...item,
// 			supplierId: existSupplier._id,
// 			categoryId: existCategory._id,
// 		}));
// 		let result = await ProductModel.insertMany(data);

// 		return res.status(200).json({
// 			message: 'Thành công.',
// 			payload: result,
// 		});
// 	} catch (error) {
// 		console.log('<<== 🚀 error ==>>', error);
// 		return res.status(404).json({
// 			message: 'Có lỗi!',
// 			error,
// 		});
// 	}
// };
