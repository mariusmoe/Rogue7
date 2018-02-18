import { Document, model, Model, Schema } from 'mongoose';
import { NextFunction } from 'express';
import { accessRoles } from './user';


/*
 |--------------------------------------------------------------------------
 | Content schema
 |--------------------------------------------------------------------------
*/

const schema = new Schema({
	title: { type: String, unique: true, required: true },
	access: { type: String, enum: ['admin', 'user', 'everyone'], default: 'everyone', index: true },
	route: { type: String, required: true, unique: true, index: { unique: true } },

	content: { type: String, required: true },
	content_searchable: { type: String, required: true },

	description: { type: String },
	image: { type: String }, // url

	folder: { type: String },
	nav: { type: Boolean, default: false, },

	updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
},
	{
		timestamps: true
	});
// Searchable compound index
schema.index(
	{ title: 'text', content_searchable: 'text', description: 'text' },
	{ weights: { title: 3, content_searchable: 1, description: 2 } }
);


export interface content extends Document {
	title: string;
	access?: accessRoles;
	route: string;

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
	const content: content = this;
	content.populate({ path: 'updatedBy', select: ['username', 'role'] });
	content.populate({ path: 'createdBy', select: ['username', 'role'] });
	next();
});


export const Content = model<content>('Content', schema);
