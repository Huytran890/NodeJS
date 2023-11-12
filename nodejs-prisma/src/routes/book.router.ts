import { Router } from 'express';
import {
	getAllBooks,
	getBooksById,
	createBook,
	updateBook,
	deleteBook,
} from './../controllers/book.controller';

const bookRouter = Router();

bookRouter.get('/', getAllBooks);
bookRouter.get('/:id', getBooksById);
bookRouter.post('/', createBook);
bookRouter.put('/:id', updateBook);
bookRouter.delete('/:id', deleteBook);

export default bookRouter;
