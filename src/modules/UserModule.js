const User = require('../models/User')

const UserModule = {
  create: async ({ email, passwordHash, name, contactPhone }) => {    
    return new User({ email, passwordHash, name, contactPhone })     
  },
  findByEmail: async (email) => {
    return User.findOne({ email: email})
  }
}

module.exports = UserModule