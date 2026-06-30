const socketIO = require('socket.io')
const onlineUsers = new Map()
const Message = require('../models/Message')

module.exports = (server) => {
    // FIX: Removed the extra quote here -> '*'
    const io = socketIO(server, { cors: { origin: '*' } })

    io.on('connection', (socket) => {
        socket.on('join', (userId) => {
            onlineUsers.set(userId, socket.id)
            io.emit("onlineUsers", Array.from(onlineUsers.keys()))
        })

        socket.on('sendMessage', async (data) => {
            const receiverSocket = onlineUsers.get(data.receiver)
            if (receiverSocket) {
                io.to(receiverSocket).emit("receiverMessage", data)
                try {
                    await Message.findByIdAndUpdate(data._id, { status: 'delivered' })
                    const senderSocket = onlineUsers.get(data.sender)
                    if (senderSocket) io.to(senderSocket).emit('messageDelivered', { messageId: data._id })
                } catch (err) { console.log(err) }
            }
        })

        socket.on('messageRead', async ({ messageId, senderId }) => {
            try {
                await Message.findByIdAndUpdate(messageId, { status: 'read' })
                const senderSocket = onlineUsers.get(senderId)
                if (senderSocket) io.to(senderSocket).emit('messageRead', { messageId })
            } catch (err) { console.log(err) }
        })

        // Handle Real-time Message Deletion
        socket.on('messageDeleted', (data) => {
            const receiverSocket = onlineUsers.get(data.receiver)
            if (receiverSocket) {
                io.to(receiverSocket).emit('messageDeleted', data)
            }
        })

        socket.on('typing', (data) => {
            const receiverSocket = onlineUsers.get(data.receiver)
            if (receiverSocket) io.to(receiverSocket).emit('userTyping', { sender: data.sender })
        })

        socket.on('stopTyping', (data) => {
            const receiverSocket = onlineUsers.get(data.receiver)
            if (receiverSocket) io.to(receiverSocket).emit('userStopTyping', { sender: data.sender })
        })

        socket.on('disconnect', () => {
            for (let [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId)
                    break
                }
            }
            io.emit("onlineUsers", Array.from(onlineUsers.keys()))
        })
    })

    return io
}