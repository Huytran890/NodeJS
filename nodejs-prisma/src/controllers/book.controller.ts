import { PrismaClient } from '@prisma/client';

const bookClient = new PrismaClient().book;

// getAllBooks
export const getAllBooks = async (req, res) => {
	try {
		const allBooks = await bookClient.findMany();
		res.status(200).json({ data: allBooks });
	} catch (error) {
		console.log(error);
	}
};

// getAuthorById
export const getBooksById = async (req, res) => {
	try {
		const bookId = req.params.id;
		const book = await bookClient.findUnique({
			where: {
				id: +bookId,
			},
		});
		res.status(200).json({ data: book });
	} catch (error) {
		console.log(error);
	}
};

// createBook
export const createBook = async (req, res) => {
	try {
		const bookData = req.body;
		const newBook = await bookClient.create({
			data: {
				title: bookData.title,
				author: {
					connect: { id: +bookData.authorId },
				},
			},
		});
		res.status(201).json({ data: newBook });
	} catch (error) {
		console.log(error);
	}
};

// updateBook
export const updateBook = async (req, res) => {
	try {
		const bookId = req.params.id;
		const bookData = req.body;
		console.log('<<=== bookId ===>>', bookId);
		console.log('<<=== bookData ===>>', bookData);
		const updateBook = await bookClient.update({
			where: {
				id: +bookId,
			},
			data: bookData,
		});
		res.status(200).json({ data: updateBook });
	} catch (error) {
		console.log(error);
	}
};

// deleteAuthor
export const deleteBook = async (req, res) => {
	try {
		const bookId = req.params.id;
		const deleteBook = await bookClient.delete({
			where: {
				id: +bookId,
			},
		});
		res.status(200).json({ data: deleteBook });
	} catch (error) {
		console.log(error);
	}
};
