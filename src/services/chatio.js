const Chat = require('../modules/ChatModule')

const ioHandler = async (io, socket) => {
	const { id } = socket  
	socket.userId = socket.request.session.passport?.user

	/* console.log(sess)
	console.log(`Веб-сокет клиент с ID ${id} подключился`)
	const { chatId } = socket.handshake.query
	socket.join(chatId)
	*/
  const getHistory = async (receiver) => {
		try {
			const chat = await Chat.find([socket.userId, receiver])		
			const chatHistory = chat ? await Chat.getHistory(chat.id) : []
			socket.emit('chatHistory', chatHistory)
		} catch(e) {
			console.log(e)
		}
		
  }

  const sendMessage = async (receiver, text) => {
		try {
			const newMessage = await Chat.sendMessage({author: socket.userId, receiver, text})
			if(newMessage) {
				socket.emit('message-received', newMessage)
				const sockets = await io.fetchSockets()
				const receiverSocket = sockets.filter(socket => socket.userId === receiver)
				if(receiverSocket) socket.to(receiverSocket.id).emit('newMessage', {msg: text})
			}
		} catch(e) {
			console.log(e)
		}    
  }

	/* Chat.subscribe(() => {}) */

	socket.on('getHistory', getHistory)
	socket.on('sendMessage', sendMessage)
}

module.exports = ioHandler