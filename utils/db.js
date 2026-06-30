const mongoose = require('mongoose')

const connectDB = async()=>{
    try{
        await mongoose.connect('mongodb://localhost:27017/chat-app')
        console.log('Database connected !!')
    }catch(eroor){
        console.log('Error while connecting database.')
    }
}

module.exports = connectDB