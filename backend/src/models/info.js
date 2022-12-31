import mongoose from "mongoose";
import { Schema } from "mongoose";
const InfoSchema = new Schema({
  name: { type: String },
  attendants: [{ type: String }],
  courseID: { type: String },
});
const InfoModel = mongoose.model("File", InfoSchema);

export default InfoModel;
