import { Document, model, Model, Schema } from 'mongoose';
import { NextFunction } from 'express';
import { accessRoles } from './user';


/*
 |--------------------------------------------------------------------------
 | Content schema
 |--------------------------------------------------------------------------
*/

const schema = new Schema({
  title: {
    type: String,
    unique: true,
    required: true
  },
  access: {
    type: String,
    enum: ['admin', 'user', 'everyone'],
    default: 'everyone'
  },
  content: {
    type: String, // html
    required: true
  },
  folder: {
    type: String, // format: folder/subfolder/subsubfolder
  },
  route: {
    type: String,
    required: true,
    unique: true,
    index: { unique: true }
  },
  updatedBy: {
    type: Schema.Types.ObjectId, ref: 'User',
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId, ref: 'User',
    required: true,
  },
},
{
  timestamps: true
});

export interface content extends Document {
  title: string;
  route: string;
  access: accessRoles;
  content?: string;
  folder?: string;
  updatedBy?: Schema.Types.ObjectId;
  createdBy?: Schema.Types.ObjectId;
  updatedAt?: Date;
  createdAt?: Date;
}

// Before fetching one contentObject, do the following
schema.pre('findOne', function(next: NextFunction) {
  const content: content = this;
  content.populate({ path: 'updatedBy', select: ['username', 'role'] });
  content.populate({ path: 'createdBy', select: ['username', 'role'] });
  next();
});


export const Content = model<content>('Content', schema);
