const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const connectDB = require('./utils/db')
const http = require('http')
const socketServer = require('./socket/socket')
const userRoutes = require('./routes/userRoutes') 
const messageRoutes = require('./routes/messageRoutes')
const path = require('path')

const server = express()

// CORS
server.use(cors({
    origin: '*',
    credentials: true
}))
server.use(bodyParser.json())

// Static files
server.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ✅ ROOT ROUTE - Shows database status
server.get('/', (req, res) => {
    const status = mongoose.connection.readyState
    const statusText = {
        0: 'Disconnected ❌',
        1: 'Connected ✅',
        2: 'Connecting...',
        3: 'Disconnecting...'
    }
    res.json({
        message: 'Chat App Backend is running! 🚀',
        database: statusText[status] || 'Unknown',
        readyState: status,
        mongodb_uri_set: !!process.env.MONGODB_URI
    })
})

// API Routes
server.use('/api', userRoutes)
server.use('/api/messages', messageRoutes)

const chatServer = http.createServer(server)

// ✅ CONNECT TO DATABASE
console.log('🚀 Starting server...')
connectDB()

// ✅ START SOCKET
socketServer(chatServer)

// ✅ START SERVER
const PORT = process.env.PORT || 3000
chatServer.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`)
    console.log(`✅ API: http://localhost:${PORT}/api`)
    console.log(`✅ Health: http://localhost:${PORT}/`)
})