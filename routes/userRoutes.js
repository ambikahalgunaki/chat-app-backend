const express = require('express')
const { register, login, getAllUsers, updateProfilePic } = require('../controllers/userController')
const multer = require('multer') // ADD THIS
const path = require('path')     // ADD THIS

const router = express.Router()

// --- Multer Configuration for Profile Picture ---
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, 'profile-' + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage })
// -----------------------------------------------

router.post('/register', register)
router.post('/login', login)
router.get('/users', getAllUsers)

// THIS IS THE MISSING ROUTE CAUSING THE 404 ERROR:
router.post('/upload-profile', upload.single('profilePic'), updateProfilePic) 

module.exports = router