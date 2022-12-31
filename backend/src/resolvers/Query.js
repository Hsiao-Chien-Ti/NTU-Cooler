import UserModel from "../models/user";
import SyllabusModel from "../models/syllabus";
import AnnouncementModel from "../models/announcement";
import GradeModel from "../models/grade";
import ChatBoxModel from "../models/chatbox";
import InfoModel from "../models/info";
const Query = {
  info: async (parent, { courseID }) => {
    let course = await InfoModel.findOne({ courseID });
    if (!course) throw new Error(`${courseID} doesn't exist!`);
    else return course;
  },
  user: async (parent, { name, studentID, passwd, groupNum }) => {
    let user = await UserModel.findOne({ studentID: studentID });
    if (!user)
      user = await new UserModel({
        name: name,
        studentID: studentID,
        passwd: passwd,
        groupNum: groupNum,
      }).save();
    return user;
  },
  syllabus: async (parent) => {
    let syllabus = await SyllabusModel.find({});
    return syllabus;
  },
  announcement: async (parent) => {
    let announcement = await AnnouncementModel.find({});
    return announcement;
  },
  grade: async (parent, { studentID, subject }) => {
    let grade = await GradeModel.find({
      studentID: studentID,
      subject: subject,
    });
    return grade;
  },
  chatbox: async (parent, { name, courseID, studentID }) => {
    let box = await ChatBoxModel.findOne({
      name,
      courseID,
      attendats: { $in: [studentID] },
    });
    //if (!box) box = await new ChatBoxModel({ name, courseID }).save();
    return box;
  },
};
export default Query;
