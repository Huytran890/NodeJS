import { PrismaClient } from '@prisma/client';

const authorClient = new PrismaClient().author;

// getAllAuthors
export const getAllAuthors = async (req, res) => {
	try {
		const allAuthors = await authorClient.findMany({
			include: {
				books: true,
			},
		});
		res.status(200).json({ data: allAuthors });
	} catch (error) {
		console.log(error);
	}
};

// getAuthorById
export const getAuthorsById = async (req, res) => {
	try {
		const authorId = req.params.id;
		const author = await authorClient.findUnique({
			where: {
				id: +authorId,
			},
			include: {
				books: true,
			},
		});
		res.status(200).json({ data: author });
	} catch (error) {
		console.log(error);
	}
};

// createAuthor
export const createAuthor = async (req, res) => {
	try {
		const authorData = req.body;
		const newAuthor = await authorClient.create({
			data: authorData,
		});
		res.status(201).json({ data: newAuthor });
	} catch (error) {
		console.log(error);
	}
};

// updateAuthor
export const updateAuthor = async (req, res) => {
	try {
		const authorId = req.params.id;
		const authorData = req.body;
		const updateAuthor = await authorClient.update({
			where: {
				id: +authorId,
			},
			data: authorData,
		});
		res.status(200).json({ data: updateAuthor });
	} catch (error) {
		console.log(error);
	}
};

// deleteAuthor
export const deleteAuthor = async (req, res) => {
	try {
		const authorId = req.params.id;
		const deleteAuthor = await authorClient.delete({
			where: {
				id: +authorId,
			},
		});
		res.status(200).json({ data: updateAuthor });
	} catch (error) {
		console.log(error);
	}
};
