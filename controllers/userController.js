const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const userExist = await User.findOne({ email: email })
        if (userExist) {
            return res.json({ success: false, message: 'User already exists.' })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({ name, email, password: hashedPassword })
        res.json({ success: true, message: 'User registered successfully !!' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'Something went wrong !!' })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.json({ success: false, message: 'User not found !!' })
        }
        const match = await bcrypt.compare(password, user.password)
        if (match) {
            const token = jwt.sign(
                { id: user._id, email: user.email },
                'your_secret_key_here',
                { expiresIn: '7d' }
            )
            return res.json({
                success: true,
                message: 'Login successful !!',
                token: token,
                // FIX: Added profiePic here so it loads when you log in!
                user: { id: user._id, name: user.name, email: user.email, profiePic: user.profiePic }
            })
        } else {
            return res.json({ success: false, message: 'Wrong password !!' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'Something went wrong !!' })
    }
}

// Get all users except the logged-in user
exports.getAllUsers = async (req, res) => {
    try {
        const userId = req.query.userId
        const users = await User.find({ _id: { $ne: userId } }).select('-password')
        res.json({ success: true, users })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'Something went wrong !!' })
    }
}

// Upload Profile Picture
exports.updateProfilePic = async (req, res) => {
    try {
        const userId = req.body.userId
        if (!req.file) {
            return res.json({ success: false, message: 'No file uploaded' })
        }

        // Save the path to the database
        const profilePicPath = `/uploads/${req.file.filename}`
        await User.findByIdAndUpdate(userId, { profiePic: profilePicPath })

        // Get the updated user data to send back to frontend
        const updatedUser = await User.findById(userId).select('-password')
        
        // FIX: Format the user object exactly like the login response 
        // so the frontend state (user.id, user.profiePic) doesn't break
        res.json({ 
            success: true, 
            message: 'Profile picture updated!', 
            user: { 
                id: updatedUser._id, 
                name: updatedUser.name, 
                email: updatedUser.email, 
                profiePic: updatedUser.profiePic 
            }
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'Something went wrong !!' })
    }
}