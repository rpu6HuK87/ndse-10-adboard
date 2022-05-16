const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config()
/* 
//CORS
if (process.env.NODE_ENV === 'dev') {
	app.use((req, res, next) => {
		// Website you wish to allow to connect
    res.header('Access-Control-Allow-Origin', 'http://devubun:3001')    
		res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
		res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
		res.header('Access-Control-Allow-Credentials', true)
    next()
	})
}
 */
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')

app.use(bodyParser.urlencoded({extended: false}))
//app.use(bodyParser.urlencoded({ extended: true }))
//app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(cookieParser())

const sessionMW = session({
  cookie: {
    path: '/',
    httpOnly: true,
    secure: false,
    maxAge: null
  },
  name: 'user.sid',
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
	rolling: true
})
app.use(sessionMW)
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next)
io.use(wrap(sessionMW));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));
//io.use((socket, next) => sessionMW(socket.request, {}, next))

const error404 = require('./middleware/error404')
const error500 = require('./middleware/error500')

app.use(passport.initialize())
app.use(passport.session())

const userApi = require('./routes/user')
const advApi = require('./routes/adv')
app.use('/api', userApi)
app.use('/api', advApi)
app.use('/static', express.static(__dirname + '/public/assets'))
app.use(error404)
app.use(error500)

//WS
const ioHandlers = require('./services/chatio')
io.on('connection', (socket) => ioHandlers(io, socket))
//TEST WS
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html')
})

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