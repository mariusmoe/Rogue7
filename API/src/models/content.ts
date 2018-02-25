import { Document, model, Model, Schema } from 'mongoose';
import { NextFunction } from 'express';
import { accessRoles } from './user';


/*
 |--------------------------------------------------------------------------
 | Content schema
 |--------------------------------------------------------------------------
*/


const schema = new Schema({
	current: {
		title: { type: String, unique: true, required: true },
		access: { type: String, enum: ['admin', 'user', 'everyone'], default: 'everyone', index: true },
		route: { type: String, required: true, unique: true, index: { unique: true } },
		version: { type: Number, required: true },

		content: { type: String, required: true },
		content_searchable: { type: String, required: true },

		description: { type: String },
		image: { type: String }, // url

		folder: { type: String },
		nav: { type: Boolean, default: false },

		updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },

		updatedAt: { type: Date, default: Date.now },
		createdAt: { type: Date, default: Date.now },
	},
	prev: []
},
	{
		timestamps: true
	});
// Searchable compound index
schema.index(
	{ 'current.title': 'text', 'current.content_searchable': 'text', 'current.description': 'text' },
	{ weights: { 'current.title': 3, 'current.content_searchable': 1, 'current.description': 2 } }
);


export interface contentDoc extends Document {
	current: content;
	prev: content[];

	updatedAt?: Date;
	createdAt?: Date;
}

export interface content {
	title: string;
	access?: accessRoles;
	route: string;
	version: number;

	content?: string;
	content_searchable?: string;

	description?: string;
	image?: string; // url

	folder?: string;
	nav?: boolean;

	updatedBy?: Schema.Types.ObjectId;
	createdBy?: Schema.Types.ObjectId;

	updatedAt?: Date;
	createdAt?: Date;
}



// Before fetching one contentObject, do the following
schema.pre('findOne', function (next: NextFunction) {
	const content: contentDoc = this;
	content.populate({ path: 'current.updatedBy', select: ['username', 'role'] });
	content.populate({ path: 'current.createdBy', select: ['username', 'role'] });
	next();
});


export const Content = model<contentDoc>('Content', schema);
