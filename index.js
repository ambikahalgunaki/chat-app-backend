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

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
server.use(cors({
    origin: FRONTEND_URL,
    credentials: true
}))
server.use(bodyParser.json())

server.use('/uploads', express.static(path.join(__dirname, 'uploads')))

server.get('/', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Disconnected ❌'
    res.json({
        message: 'Chat App Backend is running! 🚀',
        status: 'active',
        database: dbStatus,
        timestamp: new Date().toISOString(),
        endpoints: {
            auth: '/api/register, /api/login',
            users: '/api/users',
            messages: '/api/messages'
        }
    })
})

server.use('/api', userRoutes)
server.use('/api/messages', messageRoutes)

const chatServer = http.createServer(server)

// ✅ Connect to database first, then start server
connectDB()

socketServer(chatServer)

const PORT = process.env.PORT || 3000
chatServer.listen(PORT, () => {
    console.log(`Server started listening on port ${PORT}`)
    console.log(`✅ API available at: http://localhost:${PORT}/api`)
    console.log(`✅ WebSocket available at: ws://localhost:${PORT}`)
})