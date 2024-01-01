import { z, AnyZodObject, ZodError } from 'zod';
import { ObjectId } from 'mongodb';
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

const ALLOWED_FORMAT_IMAGES = ['image/jpeg', 'image/png', 'image/jpg', 'image/svg', 'image/ico', 'image/webp', 'image/jfif'];

const storage = multer.memoryStorage();
export const upload = multer({
	storage,
	fileFilter: (req, file, cb) => {
		if (ALLOWED_FORMAT_IMAGES.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(new Error('Not supported file type!'));
		}
	},
});

export const fuzzySearch = (text: string) => {
	const regex = text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

	return new RegExp(regex, 'gi');
};

export const checkIdSchema = z.object({
	params: z.object({
		id: z.string().refine(
			(val) => {
				return ObjectId.isValid(val);
			},
			{
				message: 'Invalid ObjectId Format!',
			}
		),
	}),
});

export const getQueryDateTime = (from: Date, to: Date, type: string = 'IN') => {
	const fromDate = new Date(from);
	fromDate.setHours(0, 0, 0, 0);

	const tmpToDate = new Date(to);
	tmpToDate.setHours(0, 0, 0, 0);
	const toDate = new Date(tmpToDate.setDate(tmpToDate.getDate() + 1));

	let query = {};

	if (type === 'IN') {
		const compareFromDate = { $gte: ['$createdDate', fromDate] };
		const compareToDate = { $lt: ['$createdDate', toDate] };

		query = {
			$expr: { $and: [compareFromDate, compareToDate] },
		};
	} else {
		const compareFromDate = { $lt: ['$createdDate', fromDate] };
		const compareToDate = { $gt: ['$createdDate', toDate] };

		query = {
			$expr: { $or: [compareFromDate, compareToDate] },
		};
	}

	return query;
};

export const asyncForEach = async <T>(
	array: T[],
	callback: (item: T, index: number, array: T[]) => Promise<void>
) => {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
};

/**
 * desc validates that the request query, params and body are valid
 * @param validator the Zod validation that will be used to validate the request
 */ //thực thi việc xác thực

export const validateRequest = (validator: AnyZodObject) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			// We use parse to validate the request is valid
			await validator.parseAsync({
				body: req.body,
				query: req.query,
				params: req.params,
			});

			// Validation was successfully continue
			next();
		} catch (error) {
			// If error is instance of ZodError then return error to client to show it to user
			if (error instanceof ZodError) {
				return res.status(400).send({ msg: error.issues[0].message });
			}

			// If error is not from zod then return generic error message
			return res
				.status(500)
				.send('Error making request, contact support');
		}
	};
};
