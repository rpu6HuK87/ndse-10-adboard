const User = require('../models/User')
const bcrypt = require('bcrypt')

const UserModule = {
  create: async ({ email, password, name, contactPhone }) => {
		bcrypt.hash(password, 10, async function(err, hash) {
			if(err) throw new Error(err)
			const newUser = new User({email, passwordHash: hash, name, contactPhone })
			await newUser.save()
			return newUser			
		})		
  },
  findByEmail: async (email) => {
    return User.findOne({ email: email}).select('-__v')
  },
	model: User
}

module.exports = UserModule