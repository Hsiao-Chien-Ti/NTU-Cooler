import mongoose from "mongoose";
import { Schema } from "mongoose";

const ChatBoxSchema = new Schema({
  type: { type: Boolean },
  courseID: { type: String },
  name: { type: String, required: [true, "Name field is required."] },
  notAccess: [{ type: String }],
  messages: [
    {
      sender: { type: String },
      groupnum: { type: Number },
      body: { type: String },
      hidden: { type: Boolean },
    },
  ],
  pinMsg: { type: Number },
  participants: [{ type: String }],
});
const ChatBoxModel = mongoose.model("ChatBox", ChatBoxSchema);

export default ChatBoxModel;
