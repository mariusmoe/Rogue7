import { Document, model, Model, Schema } from 'mongoose';
import { NextFunction } from 'express';


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
  route: {
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
  access: string;
  content: string;
  updatedBy: Schema.Types.ObjectId;
  createdBy: Schema.Types.ObjectId;
  updatedAt: Date;
  createdAt: Date;
}

// Set indexing
schema.index({ route: 1 }, { unique: true });


// Before fetching one contentObject, do the following
schema.pre('findOne', function(next: NextFunction) {
  const content: content = this;
  content.populate({ path: 'updatedBy', select: ['_id', 'email', 'role']});
  content.populate({ path: 'createdBy', select: ['_id', 'email', 'role']});
  next();
});


export const Content = model<content>('Content', schema);
