const passport = require('passport')
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local')

const UserModule = require('../modules/UserModule')

passport.use('local', new LocalStrategy(
	{
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: false,
	},
	async (email, password, done) => {
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
  UserModule.model.findById(id, function (err, user) {
    if (err) { return cb(err) }
    cb(null, user)
  })
})

module.exports = passport