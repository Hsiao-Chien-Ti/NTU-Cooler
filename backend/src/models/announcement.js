import mongoose from "mongoose";
import { Schema } from "mongoose";
const AnnouncementSchema = new Schema({
    time: { type: String },
    title: { type: String },
    content: { type: String }
});
const AnnouncementModel = mongoose.model('Announcement', AnnouncementSchema);

export default AnnouncementModel