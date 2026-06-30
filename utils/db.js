const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-app'
        
        console.log('🔄 Connecting to MongoDB...')
        console.log('📡 Using MongoDB URI:', mongoURI.replace(/\/\/.*@/, '//*****@')) // Hide password
        
        // ✅ Add connection options
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
        })
        
        console.log('✅ Database connected successfully!')
        console.log('📊 Database Name:', mongoose.connection.name)
        console.log('📊 Connection State:', mongoose.connection.readyState)
    } catch (error) {
        console.error('❌ Error while connecting database:', error.message)
        console.error('💡 Please check:')
        console.error('   1. MONGODB_URI environment variable is set correctly')
        console.error('   2. MongoDB Atlas IP whitelist includes 0.0.0.0/0')
        console.error('   3. Database user credentials are correct')
        console.error('   4. Database name "chat-app" exists')
    }
}

module.exports = connectDB