const Advertisement = require('../models/Advertisement')
const ObjectID = require('mongoose').Types.ObjectId

const AdvModule = {
  find: async (params = {}) => {		
		const query = params.shortText ? {'shortText': {$regex: params.shortText, $options: 'i'}} : 
									params.description ? {'description': {$regex: params.description, $options: 'i'}} :
									params.userId  ? {'userId': ObjectID(params.userId)} :
									params.tags  ? {'tags': {$in: params.tags}} : {}
 		return Advertisement.find({...query, isDeleted : false}).select('-__v')
  },
  create: async ({ shortText, description, images,  userId, createdAt, updatedAt, tags, isDeleted }) => {
    const newAdv = new Advertisement({ shortText, description, images,  userId, createdAt, updatedAt, tags, isDeleted })
		try {
			await newAdv.save()
			return newAdv
		} catch (e) {
			return false
		}	
  },
  remove: async (id) => {
    return Advertisement.findByIdAndUpdate(id, { isDeleted: true })     
  },
	adv: Advertisement
}

module.exports = AdvModule