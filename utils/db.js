const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI
        
        // ✅ If no MONGODB_URI in environment, use localhost
        if (!mongoURI) {
            console.log('⚠️ No MONGODB_URI found, using localhost')
            await mongoose.connect('mongodb://localhost:27017/chat-app')
        } else {
            console.log('🔄 Connecting to MongoDB Atlas...')
            await mongoose.connect(mongoURI)
        }
        
        console.log('✅ DATABASE CONNECTED SUCCESSFULLY!')
        console.log('📊 Database:', mongoose.connection.name)
        
    } catch (error) {
        console.error('❌ DATABASE ERROR:', error.message)
        console.error('📝 Full error:', error)
        // DON'T exit - let the server still run
    }
}

module.exports = connectDB