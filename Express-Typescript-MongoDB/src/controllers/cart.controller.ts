import { Request, Response, NextFunction } from 'express';
import { ProductModel } from '../models/product';
import { CartModel } from '../models/cart';

export const getDetail = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;

		let found = await CartModel.findOne({ customerId: id });

		if (!found) {
			return res.status(404).json({ message: 'Không tìm thấy!' });
		}

		return res.status(200).json({
			message: 'Lấy giỏ hàng thành công.',
			payload: found,
		});
	} catch (err) {
		console.log('<<== 🚀 err ==>>', err);
		res.status(404).json({
			message: 'Xem chi tiết thất bại!',
			payload: err,
		});
	}
};

// create: async function (req, res, next) {
//   try {
//     const { customerId, productId, quantity } = req.body;

//     const getCustomer = Customer.findById(customerId);
//     const getProduct = Product.findById(productId);

//     const [customer, foundProduct] = await Promise.all([
//       getCustomer,
//       getProduct,
//     ]);

//     const errors = [];
//     if (!customer || customer.isDelete)
//       errors.push('Khách hàng không tồn tại');
//     if (!foundProduct || foundProduct.isDelete)
//       errors.push('Sản phảm không tồn tại');

//     if (foundProduct && quantity > foundProduct.stock)
//       errors.push('Sản phảm vượt quá số lượng cho phép');

//     if (errors.length > 0) {
//       return res.status(404).json({
//         code: 404,
//         message: 'Lỗi',
//         errors,
//       });
//     }

//     const cart = await Cart.findOne({ customerId })

//     const result = {};

//     if (cart) { // GIỏ hàng đã tồn tại
//       newProductCart = cart.products.map((item) => {
//         if (productId === item.productId) {
//           const nextQuantity = quantity + item.quantity;

//           if (nextQuantity > foundProduct.stock) {
//             return res.send({
//               code: 404,
//               message: `Số lượng sản phẩm ${product._id} không khả dụng`,
//             });
//           } else {
//             item.quantity = nextQuantity;
//           }
//         }

//         return item;
//       })

//       result = await Cart.findOneAndUpdate(cart._id, {
//         customerId,
//         products: newProductCart,
//       });
//     } else { // Chưa có giỏ hàng
//       const newItem = new Cart({
//         customerId,
//         products: [
//           {
//             productId,
//             quantity,
//           }
//         ]
//       });

//       result = await newItem.save();
//     }

//     return res.send({
//       code: 200,
//       message: 'Thêm sản phẩm thành công',
//       payload: result,
//     });
//   } catch (err) {
//     console.log('««««« err »»»»»', err);
//     return res.status(500).json({ code: 500, error: err });
//   }
// },
type TProductCart = {
	productId: string;
	quantity: number;
};

export const create = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { customerId, productId, quantity } = req.body;

		const getProduct = await ProductModel.findById(productId);

		if (!getProduct || getProduct.isDeleted) {
			return res.status(404).json({
				code: 404,
				message: 'Sản phẩm không tồn tại!',
			});
		}

		if (quantity > getProduct.stock) {
			return res.status(404).json({
				code: 404,
				message: 'Sản phẩm vượt quá số lượng cho phép!',
			});
		}

		const cart = await CartModel.findOne({ customerId }).lean();

		let result: any = {};

		if (cart) {
			//@ts-ignore
			let newProductCart: TProductCart[] = [...cart.products];

			const checkProductExists = newProductCart.find(
				(product) => product.productId.toString() === productId.toString()
			);

			if (!checkProductExists) {
				newProductCart.push({
					productId,
					quantity,
				});
			} else {
				const nextQuantity = quantity + checkProductExists.quantity;

				if (nextQuantity > getProduct.stock) {
					return res.status(404).json({
						code: 404,
						message: `Số lượng sản phẩm ${getProduct._id} không khả dụng!`,
					});
				}

				newProductCart = newProductCart.map((item) => {
					if (item.productId.toString() === productId.toString()) {
						return {
							...item,
							quantity: nextQuantity,
						};
					}
					return item;
				});
			}

			result = await CartModel.findByIdAndUpdate(
				cart._id,
				{
					customerId,
					products: newProductCart,
				},
				{ new: true }
			);
		} else {
			const newItem = new CartModel({
				customerId,
				products: [
					{
						productId,
						quantity,
					},
				],
			});

			result = await newItem.save();
		}

		return res.status(200).json({
			message: 'Thêm sản phẩm thành công.',
			payload: result,
		});
	} catch (err: any) {
		console.log('<<== 🚀 err ==>>', err);
		return res.status(500).json({ error: err.message });
	}
};

export const remove = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { productId, customerId } = req.body;

		const cart = await CartModel.findOne({ customerId });

		if (!cart) {
			return res.status(404).json({
				code: 404,
				message: 'Giỏ hàng không tồn tại!',
			});
		}

		if (
			cart.products.length === 1 &&
			cart.products[0].productId === productId
		) {
			await CartModel.deleteOne({ _id: cart._id });
		} else {
			await CartModel.findOneAndUpdate(cart._id, {
				customerId,
				products: cart.products.filter((item) => item.productId !== productId),
			});
		}

		return res.status(200).json({
			message: 'Xóa thành công.',
		});
	} catch (err) {
		console.log('<<== 🚀 err ==>>', err);
		return res.status(500).json({ error: err });
	}
};
