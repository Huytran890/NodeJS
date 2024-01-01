import { Request, Response, NextFunction } from 'express';
import { fuzzySearch } from '../helpers';
import { UserModel } from '../models/user';
import mongoose from 'mongoose';

const getAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const role: any = req.query.role;
		const payload = await UserModel.aggregate()
			.match({ role: role.toUpperCase(), isDeleted: false })
			.addFields({
				fullName: { $concat: ['$firstName', ' ', '$lastName'] },
			})
			.project({
				password: 0,
				isDeleted: 0,
			});

		res.status(200).json({
			message: 'Lấy danh sách thành công.',
			payload,
		});
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		res.status(400).json({
			message: 'Lấy danh sách không thành công!',
			error,
		});
	}
};

const create = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const {
			firstName,
			lastName,
			email,
			phoneNumber,
			address,
			password,
			birthday,
		} = req.body;

		const newUser = new UserModel({
			firstName,
			lastName,
			email,
			phoneNumber,
			address,
			password,
			birthday,
		});

		const payload = await newUser.save();

		res.status(200).json({
			message: 'Tạo mới người dùng thành công.',
			payload,
		});
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		res.status(400).json({
			message: 'Tạo mới người dùng thất bại!',
			error,
		});
	}
};

type TUser = {
	firstName?: RegExp;
	lastName?: RegExp;
	address?: RegExp;
	email?: RegExp;
	isDeleted?: boolean;
};

const search = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { firstName, lastName, address, email } = req.query;
		const conditionFind: TUser = { isDeleted: false };

		if (typeof firstName === 'string')
			conditionFind.firstName = fuzzySearch(firstName);
		if (typeof lastName === 'string')
			conditionFind.lastName = fuzzySearch(lastName);
		if (typeof address === 'string')
			conditionFind.address = fuzzySearch(address);
		if (typeof email === 'string') conditionFind.email = fuzzySearch(email);

		const payload = await UserModel.find(conditionFind);

		res.status(200).json({
			message: 'Tìm kiếm thành công.',
			payload,
		});
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		res.status(400).json({
			message: 'Tìm kiếm thất bại!',
			error,
		});
	}
};

const getDetail = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;

		const payload = await UserModel.aggregate()
			.match({
				$expr: { $eq: ['$_id', { $toObjectId: id }] },
				isDeleted: false,
			})
			.project({
				password: 0,
				isDeleted: 0,
			});

		if (payload.length === 0) {
			return res.status(400).json({
				message: 'Không tìm thấy!',
			});
		}

		return res.status(200).json({
			message: 'Xem chi tiết thành công.',
			payload,
		});
	} catch (error) {
		res.status(400).json({
			message: 'Xem chi tiết thất bại!',
			error,
		});
	}
};

const update = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;

		const payload = await UserModel.findOneAndUpdate(
			{ _id: id, isDeleted: false },
			{ ...req.body },
			{ new: true }
		).select('-password -isDeleted');

		if (!payload) {
			return res.status(404).json({ message: 'Không tìm thấy!' });
		}

		return res.status(200).json({
			message: 'Cập nhập thông tin thành công.',
			payload,
		});
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		res.status(400).json({
			message: 'Cập nhập thất bại!',
			error,
		});
	}
};

const deleteFunc = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;

		const payload = await UserModel.findOneAndUpdate(
			{ _id: id, isDeleted: false },
			{ isDeleted: true },
			{ new: true }
		);

		if (!payload) {
			return res.status(404).json({
				message: 'Không tìm thấy!',
			});
		}

		return res.status(200).json({
			payload,
			message: 'Xóa người dùng thành công.',
		});
	} catch (error) {
		res.status(400).json({
			message: 'Xóa người dùng thất bại!',
			error,
		});
	}
};

export {
	getAll,
	create,
	search,
	getDetail,
	update,
	deleteFunc,
};
