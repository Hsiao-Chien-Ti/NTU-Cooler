import UserModel from "../models/user";
import SyllabusModel from "../models/syllabus"
import FileModel from "../models/file";
import AnnouncementModel from "../models/announcement";
import GradeModel from "../models/grade"
const Mutation = {
    createUser: async (parent, { name, studentID, passwd, groupNum }) => {
        let user = await UserModel.findOne({ studentID: studentID });
        if (!user)
            user = await new UserModel({ name: name, studentID: studentID, passwd: passwd, groupNum: groupNum, login: true }).save();
        return user
    },
    login: async (parent, { studentID, passwd }) => {
        let user = await UserModel.findOne({ studentID: studentID, passwd: passwd });
        if (!user) {
            user = await UserModel.findOne({ login: false });
            if (!user)
                user = await new UserModel({ login: false }).save();
        }
        return user;
    },
    createSyllabus: async (parent, { weekNum, outline }) => {
        let syllabus = await SyllabusModel.findOne({ weekNum: weekNum });
        if (!syllabus)
            syllabus = await new SyllabusModel({ weekNum: weekNum, outline: outline }).save();
        return syllabus
    },
    createFile: async (parent, { type, info, fileName, fileLink }) => {
        let file = await FileModel.findOne({ type: type, info: info, fileName: fileName, fileLink: fileLink })
        if (!file) {
            file = await new FileModel({ type: type, info: info, fileName: fileName, fileLink: fileLink }).save()
            if (type == "weekNum") {
                let syllabus = await SyllabusModel.findOne({ weekNum: info });
                let newFile = { type: type, info: info, fileName: fileName, fileLink: fileLink }
                syllabus.file.push(newFile)
                await syllabus.save()
            }
        }
        return file
    },
    createAnnouncement: async (parent, { time, title, content }) => {
        let announcement = await AnnouncementModel.findOne({ time:time, title:title, content:content});
        if (!announcement)
            announcement = await new AnnouncementModel({ time:time, title:title, content:content}).save();
        return announcement
    },
    createGrade: async (parent, { studentID,subject,itemName,type,score,weight }) => {
        let grade = await GradeModel.findOne({ studentID:studentID,subject:subject,itemName:itemName});
        if (!grade)
            grade = await new GradeModel({ studentID:studentID,subject:subject,itemName:itemName,type:type,score:score,weight:weight}).save();
        return grade
    },
}
export default Mutation