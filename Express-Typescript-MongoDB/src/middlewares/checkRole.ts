import { Response, Request, NextFunction } from 'express';
import { UserModel } from './../models/user';
import JWT from 'jsonwebtoken';
import { UserRole } from '../constants/enum';

export const allowRoles = () => {
	// return a middleware
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			// GET BEARER TOKEN FROM HEADER
			const authHeader = req.get('Authorization');
			if (authHeader) {
				const bearerToken = authHeader.replace('Bearer', '').trim();

				// DECODE TOKEN
				const payload = await JWT.decode(bearerToken, { json: true });

				// AFTER DECODE TOKEN: GET UID FROM PAYLOAD
				const user = await UserModel.findById(payload?._id)
					.select('-password')
					.lean();
				if (user && user.role === UserRole.EMPLOYEE) {
					return next();
				}
			}

			return res
				.status(403)
				.json({ message: 'Tài khoản không có quyền thao tác!' }); // user is forbidden
		} catch (error) {
			console.log('««««« error »»»»»', error);
			res.status(403).json({ message: 'Forbidden' }); // user is forbidden
		}
	};
};
