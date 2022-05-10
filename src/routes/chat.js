const express = require('express')
const router = express.Router()

const Chat = require('../modules/ChatModule')


router.get('/chat',
	async (req, res) => {
		const msg = await Chat.sendMessage({
			author: '6274112b095b7819636ee9bc',
			receiver: '6274112b095b7819636ee9ba',
			text: 'дратути!'
		})
		res.json({ msg: msg })
	}
)


module.exports = router