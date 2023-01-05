import mongoose from "mongoose";
import { Schema } from "mongoose";

const QuizSchema = new Schema({
  chatbox: {
    type: mongoose.Types.ObjectId,
    ref: "ChatBox",
  },
  groupShow: { type: Boolean },
  progress: { type: String },
});
const QuizModel = mongoose.model("Quiz", QuizSchema);

export default QuizModel;
