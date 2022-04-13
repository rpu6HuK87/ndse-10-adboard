const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  author:   {type: mongoose.ObjectId, required : true},
  sentdAt:  {type: Date, required : true},
  text:     {type: String, required : true},
  readAt:   {type: Date}
})

module.exports = mongoose.model('Message', messageSchema);