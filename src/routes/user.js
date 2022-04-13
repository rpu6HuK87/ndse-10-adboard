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
		const user = await UserModule.findByEmail(email)
		if(!user) return done(null, false, {message: 'Неверные логин или пароль'})
		bcrypt.compare(password, user.passwordHash, (err, result) => {
			if(err) return done(err)
			if(result) return done(null, user)
		})
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

router.post('/signin', async (req, res) => {
	
})

router.post('/signup', async (req, res) => {
  const { email, name, password, phone } = req.body
  const userIsset = await UserModule.findByEmail(email)
  if(!userIsset) {
    bcrypt.hash(password, 10, async function(err, hash) {
      if(err) return false
      const passwordHash = hash
      const newUser = await UserModule.create({email, passwordHash, name, contactPhone: phone })
      console.log(newUser)
      try {
        const usr = await newUser.save()
        res.status(201).json({data: usr, status: 'ok'})
      } catch (e) {
        console.error(e)
        res.status(500).json('Ошибка сервера. Все поля заполнили?')
      }
    })
  } else res.status(200).json({error: 'email занят', status: 'error'})
})

router.post('/find', async (req, res) => {
  const { email } = req.body
  const userIsset = await UserModule.findByEmail(email)
  res.status(200).json({user: userIsset})
})


module.exports = router