import { Router } from 'express';
import {
	getAllAuthors,
	getAuthorsById,
	createAuthor,
	updateAuthor,
	deleteAuthor,
} from './../controllers/author.controller';

const authorRouter = Router();

authorRouter.get('/', getAllAuthors);
authorRouter.get('/:id', getAuthorsById);
authorRouter.post('/', createAuthor);
authorRouter.put('/:id', updateAuthor);
authorRouter.delete('/:id', deleteAuthor);

export default authorRouter;
