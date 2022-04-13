const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcrypt')

const UserModule = require('../modules/UserModule')

router.post('/signup', async (req, res) => {
  const { email, name, password, phone } = req.body
  const userIsset =  await UserModule.findByEmail(email)
  if(!userIsset) {
    bcrypt.hash(password, 10, async function(err, hash) {
      if(err) return false
      const passwordHash = hash  
      const newUser = await UserModule.create({email: email, passwordHash: passwordHash, name: name, contactPhone: phone })
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


module.exports = router