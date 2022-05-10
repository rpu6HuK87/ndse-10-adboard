const Chat = require('../models/Chat')
const Message = require('../models/Message')
const ObjectID = require('mongoose').Types.ObjectId

const ChatModule = {
  find: async ([uid1, uid2]) => {
    return Chat.findOne({users: {$all: [ObjectID(uid1), ObjectID(uid2)]}})     
  },
	sendMessage: async ({author, receiver, text}) => {
		const timestamp = Date.now()
		const message = new Message({
			author: ObjectID(author),
			sentdAt: timestamp,
			text
		})

		let userschat = await ChatModule.find([author, receiver])

		if(userschat) {			
			userschat.messages.push(message)
			await userschat.save()
		} else {
			userschat = new Chat({
				users: [ObjectID(author), ObjectID(receiver)],
				createdAt: timestamp,
				messages: [message]
			})
			await userschat.save()
		} 
		return message
	},
	getHistory: async (chatid) => {
		return Chat.findById(chatid).select('messages')
	},
	subscribe:  (cb) => cb()	
}

module.exports = ChatModule