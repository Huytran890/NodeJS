import { Request, Response, NextFunction } from 'express';
import { fuzzySearch } from '../helpers';
import { ColorModel } from '../models/color';

const getAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const payload = await ColorModel.find({ isDeleted: false });

		res.status(200).json({
			payload,
			message: 'Lấy danh sách màu thành công.',
		});
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		res.status(400).json({
			error,
			message: 'Lấy danh sách màu thất bại!',
		});
	}
};

const create = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name, description } = req.body;

		const newColor = new ColorModel({
			name,
			description,
		});

		const payload = await newColor.save();

		res.status(200).json({
			payload,
			message: 'Tạo danh sách màu thành công.',
		});
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		res.status(400).json({
			error,
			message: 'Tạo danh sách màu thất bại!',
		});
	}
};

type TColor = {
	name?: RegExp;
	description?: RegExp;
	isDeleted?: boolean;
};

const search = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name, description } = req.query;
		const conditionFind: TColor = { isDeleted: false };

		if (typeof name === 'string') conditionFind.name = fuzzySearch(name);

		if (typeof description === 'string')
			conditionFind.description = fuzzySearch(description);

		const payload = await ColorModel.find(conditionFind);

		res.status(200).json({
			payload,
			message: 'Tìm kiếm thành công.',
		});
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		res.status(400).json({
			error,
			message: 'Tìm kiếm thất bại!',
		});
	}
};

const getDetail = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;

		const payload = await ColorModel.findById(id);
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
				message: 'Mã màu đã bị xóa!',
			});
		}

		return res.status(200).json({
			payload,
			message: 'Xem chi tiết mã màu thành công.',
		});
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		res.status(400).json({
			error,
			message: 'Xem chi tiết mã màu thất bại!',
		});
	}
};

const update = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;

		const payload = await ColorModel.findOneAndUpdate(
			{ _id: id, isDeleted: false },
			{ ...req.body },
			{ new: true }
		);

		if (!payload) {
			return res.status(404).json({ message: 'Không tìm thấy!' });
		}

		return res.status(200).json({
			payload,
			message: 'Cập nhập thành công.',
		});
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		res.status(400).json({
			error,
			message: 'Cập nhập thất bại!',
		});
	}
};

const deleteFunc = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;

		const payload = await ColorModel.findOneAndUpdate(
			{ _id: id, isDeleted: false },
			{ isDeleted: true },
			{ new: true }
		);

		if (!payload) {
			return res.status(200).json({
				message: 'Không tìm thấy mã màu!',
			});
		}
		return res.status(200).json({
			payload,
			message: 'Xóa mã màu thành công.',
		});
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		res.status(400).json({
			error,
			message: 'Xóa mã màu thất bại!',
		});
	}
};

export { getAll, create, search, getDetail, update, deleteFunc };
