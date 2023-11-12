import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import createError from 'http-errors';
import { sendJsonErrors } from './helpers/responseHandler';
import passport from 'passport';

import {
	passportVerifyToken, // USING
	passportVerifyAccount,
	passportConfigBasic,
} from './middlewares/passport';
import { allowRoles } from './middlewares/checkRole';

import supplierRoute from './routes/supplier.route';
import categoryRoute from './routes/category.route';
import productRoute from './routes/product.route';
import userRoute from './routes/user.route';
import orderRoute from './routes/order.route';
import authRoute from './routes/auth.route';
import cartRoute from './routes/cart.route';

dotenv.config();

const app: Express = express();

app.use(cors({ origin: '*' })); //Cho phép gọi bất kỳ đâu

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

passport.use(passportVerifyToken);
passport.use(passportVerifyAccount);
passport.use(passportConfigBasic);

//Danh sách các routes

app.use('/auth', authRoute);
app.use('/products', productRoute);
app.use('/categories', categoryRoute);
app.use('/suppliers', supplierRoute);
app.use('/customers', userRoute);
app.use(
	'/orders',
	passport.authenticate('jwt', { session: false }),
	allowRoles(),
	orderRoute
);
app.use('/carts', cartRoute);
// app.use('/questions', questionsRouter)

//Handle Errors App
// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
	next(createError(404));
});

// error handler --> tất cả lỗi khác rơi vào đây
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
	console.log('<<< Error Handler Stack >>>', err.stack);
	//console.error('<< Middleware Error >>', err);

	sendJsonErrors(res, err);
});
//Xuất app ra cho server.ts
export default app;
