const express = require('express')
const { sendMessage, getMessages, deleteMessage, getSidebarData } = require('../controllers/messageController')
const router = express.Router()

router.post('/send', sendMessage)
router.get('/sidebar', getSidebarData) // MUST BE ABOVE /:sender/:receiver
router.get('/:sender/:receiver', getMessages)
router.delete('/:id', deleteMessage)

module.exports = router