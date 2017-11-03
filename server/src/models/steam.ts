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
  host: {
    type: String,
    required: true
  },
  port: {
    type: String,
    required: true
  }
});

export interface steamserver extends Document {
  title: string;
  route: string;
  type: string;
  host: string;
  port: string;
}



export const SteamServer = model<steamserver>('Steam', schema);
