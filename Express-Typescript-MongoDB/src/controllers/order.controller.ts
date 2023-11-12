import { Request, Response, NextFunction } from 'express';
import { OrderModel } from '../models/order';
import { UserModel } from '../models/user';
import { UserRole } from '../constants/enum';
import { asyncForEach } from '../helpers';
import { ProductModel } from '../models/product';
import mongoose from 'mongoose';

const getAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let payload = await OrderModel.find();

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

		let payload = await OrderModel.findById(id);

		if (!payload) {
			return res.status(404).json({
				message: 'Không tìm thấy!',
			});
		}

		return res.status(202).json({
			payload,
			message: 'Lấy đơn hàng thành công.',
		});
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		res.status(400).json({
			error,
			message: 'Lấy đơn hàng thất bại!',
		});
	}
};

export type TProductList = {
	productId?: mongoose.Types.ObjectId | string;
	quantity?: number;
	discount?: number;
	price?: number;
};

const create = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const data = req.body;

		const {
			customerId,
			employeeId,
			productList,
			paymentType,
			status,
			shippedDate,
			createdDate,
		} = req.body;

		const getCustomer = UserModel.findOne({
			_id: customerId,
			role: UserRole.CUSTOMER,
			isDeleted: false,
		});

		const getEmployee = UserModel.findOne({
			_id: employeeId,
			role: UserRole.EMPLOYEE,
			isDeleted: false,
		});

		const [customer, employee] = await Promise.all([getCustomer, getEmployee]);

		const errors = [];
		if (!customer) errors.push('Khách hàng không tồn tại!');
		if (!employee) errors.push('Nhân viên không tồn tại!');

		const orderDetail: TProductList[] = [];

		await asyncForEach<TProductList>(
			productList,
			async (item: TProductList) => {
				if (item) {
					const product = await ProductModel.findOne({
						_id: item.productId,
						isDeleted: false,
					});

					if (!product) {
						errors.push(`Sản phẩm ${item.productId} không khả dụng!`);
					} else {
						if (product.stock < (item?.quantity ?? 0))
							errors.push(
								`Số lượng sản phẩm '${item.productId}' không khả dụng!`
							);
						if (product.price !== item.price)
							errors.push(`Giá của sản phẩm '${item.productId}' không hợp lệ!`);
						if (product.discount !== item.discount)
							errors.push(
								`Giảm giá của sản phẩm '${item.productId}' không hợp lệ!`
							);
						if (product && product.isDeleted)
							errors.push(`Sản phẩm ${item.productId} đã bị xóa!`);
					}

					orderDetail.push({
						productId: new mongoose.Types.ObjectId(item.productId),
						quantity: item.quantity,
						price: product?.price,
						discount: product?.discount,
					});
				}
			}
		);

		if (errors.length > 0) {
			return res.status(404).json({
				code: 404,
				message: 'Có lỗi xảy ra!',
				errors,
			});
		}
		console.log('<<== 🚀 orderDetail ==>>', orderDetail);

		const newItem = new OrderModel({
			...data,
			productList: orderDetail,
		});

		let result = await newItem.save();

		// @ts-ignore
		await asyncForEach<TProductList>(result.productList, async (item) => {
			if (item && item.quantity !== undefined) {
				await ProductModel.findOneAndUpdate(
					{ _id: item.productId },
					{ $inc: { stock: -item.quantity } }
				);
			}
		});

		return res.send({
			code: 200,
			message: 'Tạo thành công',
			payload: result,
		});
	} catch (err) {
		console.log('««««« err »»»»»', err);
		return res.status(500).json({ code: 500, error: err });
	}
};

const updateStatus = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const { status } = req.body;

		let found = await OrderModel.findOne({
			_id: id,
			$nor: [
				{ status: 'CANCELED' },
				{ status: 'REJECTED' },
				{ status: 'COMPLETED' },
			],
		});

		if (found) {
			// Đang giao rồi nhưng muốn cập nhật lại thành đang chờ thì ko dc
			if (
				(found.status === 'DELIVERING' && status === 'WAITING') ||
				found.status === status
			) {
				return res
					.status(410)
					.send({ code: 400, message: 'Trạng thái không khả dụng!' });
			}

			const result = await OrderModel.findByIdAndUpdate(
				found._id,
				{ status },
				{ new: true }
			);

			return res.send({
				code: 200,
				payload: result,
				message: 'Cập nhật trạng thái thành công.',
			});
		}

		return res.status(410).send({ code: 404, message: 'Thất bại!' });
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		return res.status(500).json({ code: 500, error });
	}
};

const updateEmployee = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const { employeeId } = req.body;

		let checkOrder = await OrderModel.findOne({
			_id: id,
			$or: [{ status: 'DELIVERING' }, { status: 'WAITING' }],
		});

		if (!checkOrder) {
			return res.status(404).json({
				code: 404,
				message: 'Đơn hàng không khả dụng!',
			});
		}

		if (checkOrder.employeeId !== employeeId) {
			const employee = await UserModel.findOne({
				_id: employeeId,
				role: UserRole.EMPLOYEE,
				isDeleted: false,
			});

			if (!employee) {
				return res.status(404).json({
					code: 404,
					message: 'Nhân viên không tồn tại!',
				});
			}

			const updateOrder = await OrderModel.findByIdAndUpdate(
				id,
				{ employeeId },
				{ new: true }
			);

			if (updateOrder) {
				return res.send({
					code: 200,
					message: 'Cập nhật thành công.',
					payload: updateOrder,
				});
			}

			return res.status(404).send({ code: 404, message: 'Không tìm thấy!' });
		}

		return res.send({ code: 400, message: 'Không thể cập nhật!' });
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		return res.status(500).json({ code: 500, error });
	}
};

const updateShippingDate = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const { shippedDate } = req.body;

		const updateOrder = await OrderModel.findByIdAndUpdate(
			id,
			{ shippedDate },
			{ new: true }
		);

		if (!updateOrder) {
			return res.status(404).send({ code: 404, message: 'Không tìm thấy!' });
		}

		return res.send({
			code: 200,
			message: 'Cập nhật thành công.',
			payload: updateOrder,
		});
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		return res.status(500).json({ code: 500, error });
	}
};

export {
	getAll,
	getDetail,
	create,
	updateStatus,
	updateEmployee,
	updateShippingDate,
};
