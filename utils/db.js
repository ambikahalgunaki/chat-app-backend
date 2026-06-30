const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-app'
        
        console.log('🔄 Connecting to MongoDB...')
        
        // ✅ REMOVE deprecated options
        await mongoose.connect(mongoURI)
        
        console.log('✅ Database connected successfully!')
        console.log('📊 Database Name:', mongoose.connection.name)
    } catch (error) {
        console.log('❌ Error while connecting database:', error.message)
    }
}

module.exports = connectDB