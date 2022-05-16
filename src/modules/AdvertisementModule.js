const Advertisement = require('../models/Advertisement')
const ObjectID = require('mongoose').Types.ObjectId

const AdvModule = {
  find: async (params = {}) => {
		let query = {isDeleted: false}		
		if(params.shortText) 		query = {...query, shortText: {$regex: params.shortText, $options: 'i'}}
		if(params.description) 	query = {...query, description: {$regex: params.description, $options: 'i'}}
		if(params.userId)				query = {...query, userId: ObjectID(params.userId)}
		if(params.tags)					query = {...query, tags: {$in: params.tags}}
 		return Advertisement.find(query).select('-__v')
  },
  create: async ({ shortText, description, images,  userId, createdAt, updatedAt, tags, isDeleted }) => {
    const newAdv = new Advertisement({ shortText, description, images,  userId, createdAt, updatedAt, tags, isDeleted })
		await newAdv.save()
		return newAdv
  },
  remove: async (id) => {
    return Advertisement.findByIdAndUpdate(id, { isDeleted: true })     
  },
	adv: Advertisement
}

module.exports = AdvModule