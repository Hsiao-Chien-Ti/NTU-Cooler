import mongoose from "mongoose";
import { Schema } from "mongoose";
const UserSchema = new Schema({
    name: { type: String},
    studentID:{type:String},
    passwd:{type:String},
    groupNum:{type:Number},
});
const UserModel = mongoose.model('User', UserSchema);

export default UserModel