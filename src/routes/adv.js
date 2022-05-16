const express = require('express')
const router = express.Router()
const ObjectID = require('mongoose').Types.ObjectId

const uploader = require('../middleware/upload-file')
const onlyForAuthenticated = require('../middleware/isAuthenticated')

const Advertisement = require('../modules/AdvertisementModule')

/* 
//ДЛЯ ФРОНТА
router.post('/uploader', uploader.single('adv-img'), async (req, res) => {
	const img = req.file ? req.file.filename : ''
	res.json({filename: img})
})
 */

//GET
router.get('/advertisements',
	async (req, res, next) => {
		try {
			const allAdvs = await Advertisement.find()
			res.json(allAdvs)
		} catch(e) {
			next(e)
		}
	}
)
router.get('/advertisements/:id',
	async (req, res, next) => {
		try {
			const adv = await Advertisement.find({id: req.params.id})
			res.json(adv)
		} catch (e) {
			next(e)
		}		
	}
)

router.post('/advertisements',
	onlyForAuthenticated,
	uploader.array('adv-imgs'),
	async (req, res, next) => {		
		try{
			const images = req.files.map(f => f.filename)
			const { shortText, description } = req.body
			const datenow = Date.now()
			const newAdv = await Advertisement.create({ shortText, description, images, userId: req.session.passport.user, createdAt: datenow, updatedAt: datenow, tags: [], isDeleted: false })
			if(newAdv) res.status(201).json(newAdv)
		} catch (e) {
			next(e)
		}
	}
)
router.delete('/advertisements/:id',
	onlyForAuthenticated,
	async (req, res, next) => {
		try {
			const adv = await Advertisement.adv.findById(req.params.id)
			if(adv && !adv.isDeleted) {
				if(adv.userId != ObjectID(req.session.passport.user)) return res.status(403).json({status: 'forbidden'})
				adv.isDeleted = true
				await adv.save()
				res.json({status: 'ok'})
			}					
		} catch (e) {
			next(e)
		}
	}
)

module.exports = router