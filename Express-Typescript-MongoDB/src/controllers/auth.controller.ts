import { Request, Response, NextFunction } from 'express';
import { generateToken, generateRefreshToken } from '../helpers/jwtHelper';
import { UserModel } from '../models/user';
import jwtSettings from '../constants/jwtSetting';
import { TUser } from '../middlewares/passport';
import JWT from 'jsonwebtoken';
import { UserRole } from '../constants/enum';

const login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const {
			_id,
			firstName,
			lastName,
			phoneNumber,
			address,
			email,
			birthday,
			updatedAt,
		} = req.user as TUser;
		const token = generateToken({
			_id,
			firstName,
			lastName,
			phoneNumber,
			address,
			email,
			birthday,
			updatedAt,
		});
		const refreshToken = generateRefreshToken(_id);
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: false,
			path: '/',
			sameSite: 'strict',
		});
		return res.status(200).json({
			token,
		});
	} catch (error) {
		console.log('<<== 🚀 error ==>>', error);
		return res.status(500).json({ code: 500, error });
	}
};

const checkRefreshToken = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const refreshToken = req.cookies.refreshToken;

		if (!jwtSettings.SECRET) {
			throw new Error('JWT secret is not defined!');
		}
		JWT.verify(
			refreshToken,
			jwtSettings.SECRET,
			async (err: any, payload: any) => {
				if (err) {
					return res.status(401).json({
						message: 'refreshToken is invalid',
					});
				} else {
					const { id } = payload;
					// const user: any = await UserModel.aggregate()
					// 	.match({
					// 		_id: new mongoose.Types.ObjectId(id),
					// 		isDeleted: false,
					// 	})
					// 	.project({
					// 		password: 0,
					// 	});
					const user: any = await UserModel.findOne({
						_id: id,
						role: UserRole.EMPLOYEE,
						isDeleted: false,
					})
						.select('-password')
						.lean();
					console.log('<<== 🚀 employee ==>>', user);
					if (user) {
						const {
							_id,
							firstName,
							lastName,
							phoneNumber,
							address,
							email,
							birthday,
							updatedAt,
						} = user;

						const token = generateToken({
							_id,
							firstName,
							lastName,
							phoneNumber,
							address,
							email,
							birthday,
							updatedAt,
						});

						return res.status(200).json({ token });
					}
					return res.sendStatus(401);
				}
			}
		);
	} catch (err) {
		console.log('<<== 🚀 err ==>>', err);
		res.status(400).json({
			statusCode: 400,
			message: 'Có lỗi xảy ra!',
		});
	}
};

const basicLogin = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await UserModel.aggregate()
			.match({
				// @ts-ignore
				_id: req?.user?._id,
			})
			.project({
				password: 0,
			});
		// .findById(req.user._id)
		//   .select('-password')
		//   .lean();
		const token = generateToken(user);
		// const refreshToken = generateRefreshToken(user._id);

		res.json({
			token,
			// refreshToken,
		});
	} catch (err: any) {
		console.log('<<== 🚀 err ==>>', err);
		res.status(400).json({
			error: err.message,
		});
	}
};

const getMe = async (req: Request, res: Response, next: NextFunction) => {
	try {
		res.status(200).json({
			message: 'Lấy thông tin thành công.',
			payload: req.user,
		});
	} catch (err: any) {
		console.log('<<== 🚀 err ==>>', err);
		res.status(500).json({
			error: err.message,
		});
	}
};

export { login, checkRefreshToken, basicLogin, getMe };
