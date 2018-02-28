import { Document, model, Model, Schema } from 'mongoose';
import { NextFunction } from 'express';


/*
 |--------------------------------------------------------------------------
 | SteamServer schema
 |--------------------------------------------------------------------------
*/

const schema = new Schema({
	title: {
		type: String,
		unique: true,
		required: true
	},
	route: {
		type: String,
		required: true,
		unique: true,
		index: { unique: true }
	},
	type: {
		type: String,
		required: true
	},
	address: {
		type: String,
		required: true
	},
	port: {
		type: String,
		required: true
	}
});

export interface Steam extends Document {
	title: string;
	route: string;
	type: string;
	address: string;
	port: string;
}



export const SteamModel = model<Steam>('Steam', schema);
