import { Request, Response, NextFunction } from 'express';
import { fuzzySearch } from '../helpers';
import { SizeModel } from '../models/size';

const getAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const payload = await SizeModel.find({ isDeleted: false });

		res.status(200).json({
			payload,
			message: 'Lấy danh sách size thành công.',
		});
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		res.status(400).json({
			error,
			message: 'Lấy danh sách size thất bại!',
		});
	}
};

const create = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name } = req.body;

		const newSize = new SizeModel({
			name,
		});

		const payload = await newSize.save();

		res.status(200).json({
			payload,
			message: 'Tạo danh sách size thành công.',
		});
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		res.status(400).json({
			error,
			message: 'Tạo danh sách size thất bại!',
		});
	}
};

type TSize = {
	name?: RegExp;
	isDeleted?: boolean;
};

const search = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name } = req.query;
		const conditionFind: TSize = { isDeleted: false };

		if (typeof name === 'string') conditionFind.name = fuzzySearch(name);

		const payload = await SizeModel.find(conditionFind);

		res.status(200).json({
			payload,
			message: 'Tìm kiếm size thành công.',
		});
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		res.status(400).json({
			error,
			message: 'Tìm kiếm size thất bại!',
		});
	}
};

const getDetail = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;

		const payload = await SizeModel.findById(id);
		// const payload = await SupplierModel.findOne({
		// 	_id: id,
		// 	isDeleted: false,
		// });

		if (!payload) {
			return res.status(400).json({
				message: 'Không tìm thấy!',
			});
		}

		if (payload.isDeleted) {
			return res.status(400).json({
				message: 'Size đã bị xóa!',
			});
		}

		return res.status(200).json({
			payload,
			message: 'Xem chi tiết size thành công.',
		});
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		res.status(400).json({
			error,
			message: 'Xem chi tiết size thất bại!',
		});
	}
};

const update = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;

		const payload = await SizeModel.findOneAndUpdate(
			{ _id: id, isDeleted: false },
			{ ...req.body },
			{ new: true }
		);

		if (!payload) {
			return res.status(404).json({ message: 'Không tìm thấy!' });
		}

		return res.status(200).json({
			payload,
			message: 'Cập nhập size thành công.',
		});
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		res.status(400).json({
			error,
			message: 'Cập nhập size thất bại!',
		});
	}
};

const deleteFunc = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;

		const payload = await SizeModel.findOneAndUpdate(
			{ _id: id, isDeleted: false },
			{ isDeleted: true },
			{ new: true }
		);

		if (!payload) {
			return res.status(200).json({
				message: 'Không tìm thấy size!',
			});
		}
		return res.status(200).json({
			payload,
			message: 'Xóa thành công.',
		});
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		res.status(400).json({
			error,
			message: 'Xóa size thất bại!',
		});
	}
};

export { getAll, create, search, getDetail, update, deleteFunc };