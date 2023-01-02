import UserModel from "../models/user";
import SyllabusModel from "../models/syllabus";
import AnnouncementModel from "../models/announcement"
import GradeModel from "../models/grade";
import FileModel from "../models/file"
const Query = {
    user: async (parent) => {
        let user = await UserModel.find({});
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
    grade: async (parent,{studentID,subject}) => {
        let grade= await GradeModel.find({$and:[{studentID:studentID},{subject:subject}]});
        return grade
    },
    file: async (parent) => {
        let file= await FileModel.find({});
        return file
    },
}
export default Query;