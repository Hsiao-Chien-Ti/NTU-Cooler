import mongoose from "mongoose";
import { Schema } from "mongoose";
const SyllabusSchema = new Schema({
    weeknum: { type: Number },
    outline: { type: String },
    file: [{ fileName: { type: String }, file: { type: String } }]
});
const SyllabusModel = mongoose.model('Syllabus', SyllabusSchema);

export default SyllabusModel