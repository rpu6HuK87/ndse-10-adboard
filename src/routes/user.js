const express = require('express')
const router = express.Router()
const passport = require('../services/auth')

const UserModule = require('../modules/UserModule')

router.post('/signin',
	passport.authenticate('local', { failureRedirect: '/api/failurejson', failureMessage: true }),
	(req, res) => {
		res.json({data: req.user, status: 'ok'})	
	}
)
router.get('/failurejson',
	(req, res) => {
		res.json({ error: 'Неверный логин или пароль', status: 'error' })
	}
)

router.post('/signup',
	async (req, res, next) => {
		try {
			const { email, name, password, contactPhone } = req.body
			const userIsset = await UserModule.findByEmail(email)
			if(!userIsset) {
				if(!email || !name || !password) throw new Error('Не все поля заполнены')			
				const newUser = await UserModule.create({email, password, name, contactPhone })						
				res.status(201).json({data: newUser, status: 'ok'})
			} else res.status(200).json({error: 'email занят', status: 'error'})
		} catch (e) {
			next(e)
		}
	}
)
router.post('/find',
	async (req, res, next) => {
		try {
			const { email } = req.body
			const user = await UserModule.findByEmail(email)
			res.json({user})
		} catch (e) {
			next(e)
		}
	}
)

module.exports = router