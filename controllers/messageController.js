const Message = require('../models/Message')
const User = require('../models/User') // <--- ADD THIS LINE RIGHT HERE!

exports.sendMessage = async (req, res) => {
    try {
        const { sender, receiver, message, fileURL } = req.body
        const msg = await Message.create({ sender, receiver, message, fileURL: fileURL || '' })
        res.status(201).json(msg)
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Something went wrong !!' })
    }
}

exports.getMessages = async (req, res) => {
    try {
        const { sender, receiver } = req.params
        const data = await Message.find({
            $or: [{ sender, receiver }, { sender: receiver, receiver: sender }]
        }).sort({ createdAt: 1 })
        res.json(data)
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Something went wrong !!' })
    }
}

// NEW: Delete Message
exports.deleteMessage = async (req, res) => {
    try {
        const { id } = req.params
        const { deleteForEveryone } = req.body
        
        if (deleteForEveryone) {
            // Replace text with "Message deleted" for both users
            const msg = await Message.findByIdAndUpdate(id, { 
                message: '🚫 This message was deleted', 
                isDeleted: true 
            }, { new: true })
            return res.json({ success: true, message: msg })
        } else {
            // Delete completely just for the user requesting it
            await Message.findByIdAndDelete(id)
            return res.json({ success: true, message: 'Deleted for you' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Something went wrong !!' })
    }
}

// NEW: Get Last Messages & Unread Counts for Sidebar
exports.getSidebarData = async (req, res) => {
    try {
        const userId = req.query.userId
        // Now 'User' is defined and will work!
        const users = await User.find({ _id: { $ne: userId } }).select('-password')
        
        const sidebarData = await Promise.all(users.map(async (u) => {
            const lastMessage = await Message.findOne({
                $or: [{ sender: userId, receiver: u._id }, { sender: u._id, receiver: userId }]
            }).sort({ createdAt: -1 })

            const unreadCount = await Message.countDocuments({ 
                sender: u._id, 
                receiver: userId, 
                status: { $ne: 'read' } 
            })

            return { user: u, lastMessage, unreadCount }
        }))

        res.json({ success: true, data: sidebarData })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Something went wrong !!' })
    }
}