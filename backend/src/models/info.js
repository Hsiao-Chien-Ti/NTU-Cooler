import mongoose from "mongoose";
import { Schema } from "mongoose";
const InfoSchema = new Schema({
  name: { type: String },
  attendants: [
    {
      name: { type: String },
      studentID: { type: String },
      isTeacher: { type: Boolean },
    },
  ],
  courseID: { type: String },
});
const InfoModel = mongoose.model("Info", InfoSchema);

export default InfoModel;
