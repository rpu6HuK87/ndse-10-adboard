const express = require('express')
const router = express.Router()

const passport = require('passport')
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local')

const UserModule = require('../modules/UserModule')
const User = require('../models/User')

passport.use('local', new LocalStrategy(
	{
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: false,
	},
	async (email, password, done) => {
		console.log(email, password)
		const user = await UserModule.findByEmail(email)
		//console.log(user)
		if(user) {
			bcrypt.compare(password, user.passwordHash, (err, result) => {
				if(err) done(err)
				if(result) done(null, user)
				else return done(null, false)
			})
		} else return done(null, false)
		
		
	}
))
passport.serializeUser(function (user, cb) {
  cb(null, user.id)
})
passport.deserializeUser(function (id, cb) {
  User.findById(id, function (err, user) {
    if (err) { return cb(err) }
    cb(null, user)
  })
})

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
	async (req, res) => {
		const { email, name, password, contactPhone } = req.body
		//мини-валидация
		if(email && name && password) {
			const userIsset = await UserModule.findByEmail(email)
			//создаем юзверя
			if(!userIsset) {
				bcrypt.hash(password, 10, async function(err, hash) {
					if(err) return false
					const passwordHash = hash
					const newUser = await UserModule.create({email, passwordHash, name, contactPhone })
					console.log(newUser)
					try {
						const usr = await newUser.save()
						res.status(201).json({data: usr, status: 'ok'})
					} catch (e) {
						console.error(e)
						res.status(500).json({error: e, status: 'error'})
					}
				})
			} else res.status(200).json({error: 'email занят', status: 'error'})
		} else res.status(500).json({error: 'Невалидные данные', status: 'error'})		
	}
)

router.post('/find',
	async (req, res) => {
		const { email } = req.body
		const userIsset = await UserModule.findByEmail(email)
		res.status(200).json({user: userIsset})
	}
)

module.exports = router