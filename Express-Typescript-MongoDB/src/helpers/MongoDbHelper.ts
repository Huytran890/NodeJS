'use strict';
const { MongoClient, ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const path = require('path');

// INSERT: Thêm mới (một)
export function insertDocument(data: any, collectionName: any) {
	return new Promise((resolve, reject) => {
		mongoose
			.model(collectionName)
			.create(data)
			.then((result: any) => {
				resolve({ result: result });
			})
			.catch((err: any) => {
				reject(err);
			});
	});
}

export function insertDocuments(list: any, collectionName: any) {
	return new Promise((resolve, reject) => {
		mongoose
			.model(collectionName)
			.insertMany(list)
			.then((result: any) => {
				resolve(result);
			})
			.catch((err: any) => {
				reject(err);
			});
	});
}

// ----------------------------------------------------------------------------
// UPDATE: Sửa

export function updateDocument(condition: any, data: any, collectionName: any) {
	return new Promise((resolve, reject) => {
		mongoose
			.model(collectionName)
			.findOneAndUpdate(condition, { $set: data })
			.then((result: any) => {
				resolve(result);
			})
			.catch((err: any) => {
				reject(err);
			});
	});
}

export function findDocument(id: any, collectionName: any) {
	return new Promise((resolve, reject) => {
		const collection = mongoose.model(collectionName);
		const query = { _id: id };
		collection
			.findOne(query)
			.then((result: any) => {
				resolve(result);
			})
			.catch((err: any) => {
				reject(err);
			});
	});
}

export function toSafeFileName(fileName: any) {
	const fileInfo = path.parse(fileName);

	const safeFileName =
		fileInfo.name.replace(/[^a-z0-9]/gi, '-').toLowerCase() + fileInfo.ext;
	return `${Date.now()}-${safeFileName}`;
}
