import UserModel from "../models/user";
import SyllabusModel from "../models/syllabus";
import AnnouncementModel from "../models/announcement";
import GradeModel from "../models/grade";
import ChatBoxModel from "../models/chatbox";

import FileModel from "../models/file";
import InfoModel from "../models/info";
const Query = {
  info: async (parent, { courseID }) => {
    let course = await InfoModel.findOne({ courseID });
    if (!course) throw new Error(`${courseID} doesn't exist!`);
    else return course;
  },
  user: async (parent, { name, studentID, passwd, groupNum, isTeacher }) => {
    let user = await UserModel.findOne({ studentID: studentID });
    if (!user)
      user = await new UserModel({
        name: name,
        studentID: studentID,
        passwd: passwd,
        groupNum: groupNum,
        isTeacher,
      }).save();
    return user;
  },
  userChatbox: async (parent, { studentID, courseID }) => {
    let user = await UserModel.findOne({ studentID });
    return user.chatbox
      ? user.chatbox.filter((box) => box.courseID == courseID)
      : [];
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
  file: async (parent) => {
    let file = await FileModel.find({});
    return file;
  },
  chatbox: async (parent, { name, courseID, studentID }) => {
    let box = await ChatBoxModel.findOne({
      name,
      courseID,
      attendats: { $in: [studentID] },
    });
    if (!box) box = await new ChatBoxModel({ name, courseID }).save();
    return box;
  },
};
export default Query;
