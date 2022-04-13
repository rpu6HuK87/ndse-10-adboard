const { Schema, model } = require('mongoose')

const chatSchema = new Schema({
  users: {type: Array, required : true},
  createdAt: {type: Date, required : true},
  messages: {type: Array}
})

module.exports = model('Chat', chatSchema);