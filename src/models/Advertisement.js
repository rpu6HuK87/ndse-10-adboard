const mongoose = require('mongoose')

const adSchema = new mongoose.Schema({
  shortText:    {type: String, required : true},
  description:  {type: String},
  images:       {type: Array},
  userId:       {type: mongoose.ObjectId, required : true},
  createdAt:    {type: Date, required : true},
  updatedAt:    {type: Date, required : true},
  tags:         {type: Array},
  isDeleted:    {type: Boolean , required: true}
})

module.exports = mongoose.model('Advertisement', adSchema);