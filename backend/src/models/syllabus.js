import mongoose from "mongoose";
import { Schema } from "mongoose";
const SyllabusSchema = new Schema({
    weekNum: { type: String },
    outline: { type: String },
    file: [{ fileName: { type: String }, fileLink: { type: String },linkType:{type:Boolean} }]
});
const SyllabusModel = mongoose.model('Syllabus', SyllabusSchema);

export default SyllabusModel