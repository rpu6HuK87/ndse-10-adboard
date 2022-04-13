const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config()

//CORS
if (process.env.NODE_ENV === 'dev') {
	app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
	})
}

const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')

app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())

const sessionMW = session({
  cookie: {
    path: '/',
    httpOnly: true,
    secure: false,
    maxAge: null,
  },
  name: 'user.sid',
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false
})
app.use(sessionMW)
io.use((socket, next) => {
  sessionMW(socket.request, {}, next)
})

const error404 = require('./middleware/error404')
const error500 = require('./middleware/error500')

app.use(passport.initialize())
app.use(passport.session())

const userApi = require('./routes/user')

app.use('/api', userApi)
app.use('/static', express.static(__dirname + '/public/assets'))

app.use(error404)
app.use(error500)

const PORT = process.env.PORT || 3000
const DBNAME = process.env.DB_NAME
const DBUSER = process.env.DB_USERNAME
const DBPASS = process.env.DB_PASSWORD
const DBURL = process.env.DB_URL

;(async () => {
  try {
    await mongoose.connect(DBURL, {
      user: DBUSER,
      pass: DBPASS,
      dbName: DBNAME,
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    server.listen(PORT, () => console.log(`Сервер запущен на ${PORT} порту`))
  } catch(e) {
    console.log(e)
  }
})()