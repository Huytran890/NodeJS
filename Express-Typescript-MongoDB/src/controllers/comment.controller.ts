import { Request, Response, NextFunction } from 'express';
import { fuzzySearch } from '../helpers';
import { CommentModel } from '../models/comment';
import { UserModel } from '../models/user';
import { Rating, UserRole } from '../constants/enum';
import { ProductModel } from '../models/product';

const getAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const payload = await CommentModel.find({ isDeleted: false });

		res.status(200).json({
			payload,
			message: 'Lấy danh sách bình luận thành công.',
		});
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		res.status(400).json({
			error,
			message: 'Lấy danh sách bình luận thất bại!',
		});
	}
};

const create = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { commentText, rating, productId, customerId } = req.body;

		const newComment = new CommentModel({
			commentText,
			rating,
            productId,
            customerId,
		});

        const getCustomer = UserModel.findOne({
			_id: customerId,
			role: UserRole.CUSTOMER,
			isDeleted: false,
		});

		const getProduct = ProductModel.findOne({
			_id: productId,
			isDeleted: false,
		});

		const [customer, product] = await Promise.all([getCustomer, getProduct]);

		const errors = [];
		if (!customer) errors.push('Khách hàng không tồn tại!');
		if (!product) errors.push('Sản phẩm không tồn tại!');


		const payload = await newComment.save();

		res.status(200).json({
			payload,
			message: 'Tạo danh sách bình luận thành công.',
		});
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		res.status(400).json({
			error,
			message: 'Tạo danh sách bình luận thất bại!',
		});
	}
};

type TComment = {
	commentText?: RegExp;
	isDeleted?: boolean;
};

const search = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { commentText } = req.query;
		const conditionFind: TComment = { isDeleted: false };

		if (typeof commentText === 'string') conditionFind.commentText = fuzzySearch(commentText);

		const payload = await CommentModel.find(conditionFind);

		res.status(200).json({
			payload,
			message: 'Tìm kiếm bình luận thành công.',
		});
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		res.status(400).json({
			error,
			message: 'Tìm kiếm bình luận thất bại!',
		});
	}
};

// const getDetail = async (req: Request, res: Response, next: NextFunction) => {
// 	try {
// 		const { id } = req.params;

// 		const payload = await CommentModel.findById(id);
// 		// const payload = await SupplierModel.findOne({
// 		// 	_id: id,
// 		// 	isDeleted: false,
// 		// });

// 		if (!payload) {
// 			return res.status(400).json({
// 				message: 'Không tìm thấy!',
// 			});
// 		}

// 		if (payload.isDeleted) {
// 			return res.status(400).json({
// 				message: 'Bình luận đã bị xóa!',
// 			});
// 		}

// 		return res.status(200).json({
// 			payload,
// 			message: 'Xem chi tiết thành công.',
// 		});
// 	} catch (error) {
// 		console.log('<<== 🚀 error ==>>', error);
// 		res.status(400).json({
// 			error,
// 			message: 'Xem chi tiết không thành công!',
// 		});
// 	}
// };

const update = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;

		const payload = await CommentModel.findOneAndUpdate(
			{ _id: id, isDeleted: false },
			{ ...req.body },
			{ new: true }
		);

		if (!payload) {
			return res.status(404).json({ message: 'Không tìm thấy!' });
		}

		return res.status(200).json({
			payload,
			message: 'Cập nhập bình luận thành công.',
		});
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		res.status(400).json({
			error,
			message: 'Cập nhập bình luận thất bại!',
		});
	}
};

const deleteFunc = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;

		const payload = await CommentModel.findOneAndUpdate(
			{ _id: id, isDeleted: false },
			{ isDeleted: true },
			{ new: true }
		);

		if (!payload) {
			return res.status(200).json({
				message: 'Không tìm thấy bình luận!',
			});
		}
		return res.status(200).json({
			payload,
			message: 'Xóa bình luận thành công.',
		});
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		res.status(400).json({
			error,
			message: 'Xóa bình luận thất bại!',
		});
	}
};

export { getAll, create, search, update, deleteFunc };