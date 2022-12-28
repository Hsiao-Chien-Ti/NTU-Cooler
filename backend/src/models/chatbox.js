import mongoose from "mongoose";
import { Schema } from "mongoose";
const ChatboxSchema = new Schema({
    type: { type: Boolean },
    chatboxName: { type: String },
    notAccess: [{ type: String }],
    msgs: [{ sender: { type: String }, groupnum: { type: Number }, body: { type: String }, hidden: { type: Boolean } }],
    pinMsg:{ sender: { type: String }, groupnum: { type: Number }, body: { type: String }, hidden: { type: Boolean } },
    participants:[{participant:{type:String}}]
});
const ChatboxModel = mongoose.model('Chatbox', ChatboxSchema);

export default ChatboxModel