const mongoose = require('mongoose')

const msgSchema = new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    message:{type:String},
    fileURL:{type:String},
    isRead:{type:Boolean,default:false}
},{timestamps:true})

module.exports = mongoose.model('Message',msgSchema)