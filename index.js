const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const connectDB = require('./utils/db')
const http = require('http')
const socketServer = require('./socket/socket')
const userRoutes = require('./routes/userRoutes') 
const messageRoutes = require('./routes/messageRoutes')
const path = require('path') // NEEDED FOR UPLOADS

const server = express()
server.use(cors())
server.use(bodyParser.json())

// THIS MAKES YOUR UPLOADED IMAGES ACCESSIBLE IN THE BROWSER:
server.use('/uploads', express.static(path.join(__dirname, 'uploads')))

server.use('/api', userRoutes) // THIS CONNECTS THE ROUTES
server.use('/api/messages', messageRoutes)

const chatServer = http.createServer(server)

connectDB()
socketServer(chatServer)

chatServer.listen(3000, () => {
    console.log('Server started listening on port 3000')
})