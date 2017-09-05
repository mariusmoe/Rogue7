const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

/*
 |--------------------------------------------------------------------------
 | Content schema
 |--------------------------------------------------------------------------
*/
const contentSchema = new Schema({
  route: {
    type: String,
    unique: true,
    required: true
  },
  content: {
    type: String, // html
    required: true
  },
  access: {
    type: String,
    enum: ['admin', 'user', 'everyone'],
    default: 'everyone'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
    required: true,
  },
},
{
  timestamps: true
});


module.exports = mongoose.model('Content', contentSchema);
