import { Request, Response, NextFunction } from 'express';
import { fuzzySearch } from '../helpers';
import { SupplierModel } from '../models/supplier';

const getAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const payload = await SupplierModel.find({ isDeleted: false });

		res.status(200).json({
			payload,
			message: 'Lấy danh sách thành công.',
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
		const { name, email, phoneNumber, address } = req.body;

		const newSupplier = new SupplierModel({
			name,
			email,
			phoneNumber,
			address,
		});

		const payload = await newSupplier.save();

		res.status(200).json({
			payload,
			message: 'Tạo danh sách thành công.',
		});
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		res.status(400).json({
			error,
			message: 'Tạo danh sách không thành công!',
		});
	}
};

type TSupplier = {
	name?: RegExp;
	email?: RegExp;
	address?: RegExp;
	isDeleted?: boolean;
};

const search = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name, address, email } = req.query;
		const conditionFind: TSupplier = { isDeleted: false };

		if (typeof name === 'string') conditionFind.name = fuzzySearch(name);
		if (typeof address === 'string')
			conditionFind.address = fuzzySearch(address);
		if (typeof email === 'string') conditionFind.email = fuzzySearch(email);

		console.log('<<== 🚀 conditionFind ==>>', conditionFind);

		const payload = await SupplierModel.find(conditionFind);

		res.status(200).json({
			payload,
			message: 'Tìm kiếm thành công',
		});
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		res.status(400).json({
			error,
			message: 'Tìm kiếm không thành công',
		});
	}
};

const getDetail = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;

		const payload = await SupplierModel.findById(id);
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
				message: 'Nhà cung cấp đã bị xóa!',
			});
		}

		return res.status(200).json({
			payload,
			message: 'Xem chi tiết thành công.',
		});
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		res.status(400).json({
			error,
			message: 'Xem chi tiết không thành công!',
		});
	}
};

const update = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;

		const payload = await SupplierModel.findOneAndUpdate(
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
			message: 'Cập nhập không thành công!',
		});
	}
};

const deleteFunc = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;

		const payload = await SupplierModel.findOneAndUpdate(
			{ _id: id, isDeleted: false },
			{ isDeleted: true },
			{ new: true }
		);

		if (!payload) {
			return res.status(200).json({
				message: 'Không tìm thấy danh mục!',
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
			message: 'Xóa không thành công!',
		});
	}
};

export { getAll, create, search, getDetail, update, deleteFunc };
