const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

/*
 |--------------------------------------------------------------------------
 | Content schema
 |--------------------------------------------------------------------------
*/
const contentSchema = new Schema({
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
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
    required: true,
  },
},
{
  timestamps: true
});

contentSchema.index({ route: 1 }, { unique: true });

var autoPopulate = function(next) {
  this.populate({ path: 'updatedBy', select: ['_id', 'email', 'role']});
  this.populate({ path: 'createdBy', select: ['_id', 'email', 'role']});
  next();
};
contentSchema.pre('findOne', autoPopulate);

module.exports = mongoose.model('Content', contentSchema);
