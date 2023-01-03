import mongoose from "mongoose";
import { Schema } from "mongoose";
const HWSchema = new Schema({
    title: { type: String },
    deadline: { type: String },
    description: { type: String },
    tFile: [{ type: mongoose.Types.ObjectId, ref: 'File' }],
    sFile: [{ studentID: { type: String }, file: { type: mongoose.Types.ObjectId, ref: 'File' } }]
});
const HWModel = mongoose.model('HW', HWSchema);

export default HWModel