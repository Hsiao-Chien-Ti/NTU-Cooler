import UserModel from "../models/user";
import SyllabusModel from "../models/syllabus";
import AnnouncementModel from "../models/announcement"
const Query = {
    user: async (parent, { name,studentID,passwd,groupNum}) => {
        let user = await UserModel.findOne({ studentID:studentID });
        if (!user)
            user = await new UserModel({ name:name,studentID:studentID,passwd:passwd,groupNum:groupNum }).save();
        return user
    },
    syllabus: async (parent) => {
        let syllabus= await SyllabusModel.find({});
        return syllabus
    },
    announcement: async (parent) => {
        let announcement= await AnnouncementModel.find({});
        return announcement
    },
}
export default Query;