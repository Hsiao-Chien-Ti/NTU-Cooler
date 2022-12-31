import UserModel from "../models/user";
import SyllabusModel from "../models/syllabus";
import AnnouncementModel from "../models/announcement";
import GradeModel from "../models/grade";
import ChatBoxModel from "../models/chatbox";

import FileModel from "../models/file";
const Query = {
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
