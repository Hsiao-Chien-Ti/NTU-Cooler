import mongoose from "mongoose";
import { Schema } from "mongoose";
const FileSchema = new Schema({
    info: { type:String },
    file:{type:String},
    fileName:{type:String}
});
const FileModel = mongoose.model('File', FileSchema);

export default FileModel