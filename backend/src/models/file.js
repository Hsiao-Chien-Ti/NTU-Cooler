import mongoose from "mongoose";
import { Schema } from "mongoose";
const FileSchema = new Schema({
    type:{type:String},
    info:{type:String},
    fileLink:{type:String},
    fileName:{type:String},
    linkType:{type:Boolean}
});
const FileModel = mongoose.model('File', FileSchema);

export default FileModel