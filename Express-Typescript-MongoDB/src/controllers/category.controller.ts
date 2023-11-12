import { Request, Response, NextFunction } from 'express';
import { CategoryModel } from '../models/category';

const getAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const payload = await CategoryModel.find({ isDeleted: false });

		return res.status(200).json({
			payload,
			message: 'Lấy thông tin thành công.',
		});
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		return res.status(400).json({ message: 'Không thành công!' });
	}
};

const getDetail = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;

		const payload = await CategoryModel.findById(id);
		// const result = await Category.findOne({
		//   _id : id,
		//   isDeleted: false,
		// });

		if (!payload) {
			return res.status(404).json({
				message: 'Không tìm thấy!',
			});
		}

		if (payload.isDeleted) {
			return res.status(400).json({
				message: 'Danh mục đã bị xóa!',
			});
		}

		return res.status(202).json({
			payload,
			message: 'Lấy thông tin thành công.',
		});
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		res.status(400).json({
			error,
			message: 'Lấy danh sách thất bại!',
		});
	}
};

const create = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name, description } = req.body;

		const newCategory = new CategoryModel({
			name,
			description,
		});

		const payload = await newCategory.save();

		return res.status(202).json({
			payload,
			message: 'Tạo danh mục thành công.',
		});
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		res.status(400).json({
			error,
			message: 'Tạo danh sách không thành công!',
		});
	}
};

const update = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const { name, description } = req.body;

		// const result = await Category.findByIdAndUpdate(id, {name, description}, { new: true })
		// const result = await Category.findOneAndUpdate(
		//   {
		//     // _id : mongoose.Types.ObjectId(id)
		//     _id : id,
		//     isDeleted: false,
		//   },
		//   {name, description},
		//   { new: true },
		// );
		const payload1 = await CategoryModel.findById(id);

		if (!payload1) {
			return res.status(404).json({
				message: 'Không tìm thấy!',
			});
		}

		if (payload1.isDeleted) {
			return res.status(404).json({
				message: 'Đã bị xóa!',
			});
		}

		const payload2 = await CategoryModel.findByIdAndUpdate(
			id,
			{ name, description },
			{ new: true }
		);

		return res.status(202).json({
			payload: payload2,
			message: 'Cập nhật danh mục thành công.',
		});
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		res.status(400).json({
			error,
			message: 'Cập nhập không thành công!',
		});
	}
};

const deleteFunc = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;

		const payload1 = await CategoryModel.findById(id);

		if (!payload1) {
			return res.status(404).json({
				message: 'Không tìm thấy!',
			});
		}

		if (payload1.isDeleted) {
			return res.status(404).json({
				message: 'Danh mục đã bị xóa từ trước!',
			});
		}

		await CategoryModel.updateOne({ _id: id }, { isDeleted: true });

		return res.status(202).json({
			message: 'Xóa sản phẩm thành công.',
		});
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		res.status(400).json({
			error,
			message: 'Xóa không thành công!',
		});
	}
};
export { getAll, create, getDetail, update, deleteFunc };
