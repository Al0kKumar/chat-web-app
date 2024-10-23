import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderid:{
        type: String,
        required: true
    },
    receiverid:{
        type: String,
        required: true
    },
    content :{
        type: String,
        required: true
    },
    isRead:{
        type: Boolean,
        default:false
    }
},{timestamps: true})

const Messages = mongoose.model('Messages',messageSchema);

export default Messages;