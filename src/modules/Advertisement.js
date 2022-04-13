const Advertisement = require('../models/Advertisement')

const AdvModule = {
  find: async ({ shortText, description, userId, tags }) => {

  },
  create: async ({ shortText, description, images,  userId, createdAt, updatedAt, tags, isDeleted }) => {
    return new Advertisement({ shortText, description, images,  userId, createdAt, updatedAt, tags, isDeleted })
  },
  remove: async (id) => {
    return Advertisement.findByIdAndUpdate(id, { isDeleted: true })     
  }
}

module.exports = AdvModule