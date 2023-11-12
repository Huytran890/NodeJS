import { UserModel } from './../models/user';
import jwt, { VerifiedCallback } from 'passport-jwt';
import passportLocal from 'passport-local';
import passportHttp from 'passport-http';

import jwtSettings from '../constants/jwtSetting';

const JwtStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;
const LocalStrategy = passportLocal.Strategy;
const BasicStrategy = passportHttp.BasicStrategy;

export type TUser = {
	_id: string;
	firstName?: string;
	lastName?: string;
	address?: string;
	email: string;
	password: string;
	role?: string;
	isDeleted?: boolean;
	phoneNumber?: string;
	birthday?: Date;
	updatedAt?: Date;
	isValidPassword(password: string): Promise<boolean>;
};

const passportVerifyToken = new JwtStrategy(
	{
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey: jwtSettings.SECRET,
	},
	async (payload, done) => {
		try {
			// const user = await Employee.findOne({
			//   _id: payload._id,
			//   isDeleted: false,
			// }).select('-password');
			const user = await UserModel.aggregate()
				.match({ _id: payload._id, isDeleted: false })
				.project({
					password: 0,
				});

			if (!user) return done(null, false);
			return done(null, user);
		} catch (error) {
			return done(error, false);
		}
	}
);

const passportVerifyAccount = new LocalStrategy(
	{ usernameField: 'email' },
	async (email: string, password: string, done: VerifiedCallback) => {
		try {
			const user: TUser | null = await UserModel.findOne({
				email,
				isDeleted: false,
			});

			if (!user) return done(null, false);

			const isCorrectPass = await user.isValidPassword(password);

			user.password = '';

			if (!isCorrectPass) return done(null, false);

			return done(null, user);
		} catch (error) {
			done(error, false);
		}
	}
);

const passportConfigBasic = new BasicStrategy(async function (
	email: string,
	password: string,
	done: VerifiedCallback
) {
	try {
		const user: TUser | null = await UserModel.findOne({
			email: email,
			isDeleted: false,
		});

		if (!user) return done(null, false);

		const isCorrectPass = await user.isValidPassword(password);

		if (!isCorrectPass) return done(null, false);

		return done(null, user);
	} catch (error) {
		done(error, false);
	}
});

export { passportVerifyToken, passportVerifyAccount, passportConfigBasic };
