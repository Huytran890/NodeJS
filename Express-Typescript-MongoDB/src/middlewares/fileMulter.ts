import multer from 'multer';
import fs from 'fs';
import { toSafeFileName } from '../helpers/MongoDbHelper';

const UPLOAD_DIRECTORY = './public/uploads';




// const upload = multer({
// 	storage: multer.diskStorage({
// 		contentType: multer.AUTO_CONTENT_TYPE,
// 		destination: function (req, file, callback) {
// 			// const { id, collectionName } = req.params;

// 			const PATH = `${UPLOAD_DIRECTORY}/media/${file.fieldname}`;
// 			// console.log('PATH', PATH);
// 			if (!fs.existsSync(PATH)) {
// 				// Create a directory
// 				fs.mkdirSync(PATH, { recursive: true });
// 			}
// 			callback(null, PATH);
// 		},
// 		filename: function (req, file, callback) {
// 			const safeFileName = toSafeFileName(file.originalname);
// 			callback(null, safeFileName);
// 		},
// 	}),
// });

// module.exports = upload;
