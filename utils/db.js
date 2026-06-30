const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        // ✅ Use environment variable for MongoDB URI
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-app'
        
        console.log('🔄 Connecting to MongoDB...')
        
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        
        console.log('✅ Database connected successfully!')
        console.log('📊 Database Name:', mongoose.connection.name)
    } catch (error) {
        console.log('❌ Error while connecting database:', error.message)
        // Don't exit process - let the app still run
    }
}

module.exports = connectDB