import mongoose from "mongoose";
import { Schema } from "mongoose";
const SyllabusSchema = new Schema({
    date: { type: Date },
    title: { type: String },
    content: { type: String }
});
const SyllabusModel = mongoose.model('Syllabus', SyllabusSchema);

export default SyllabusModel