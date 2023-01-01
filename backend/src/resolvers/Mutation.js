import UserModel from "../models/user";
import SyllabusModel from "../models/syllabus";
import FileModel from "../models/file";
import AnnouncementModel from "../models/announcement";
import GradeModel from "../models/grade";
import ChatBoxModel from "../models/chatbox";
import InfoModel from "../models/info";
const Mutation = {
  createInfo: async (parent, { name, courseID, attendants }) => {
    let info = await InfoModel.findOne({ courseID });
    if (!info)
      info = await new InfoModel({
        name,
        courseID,
        attendants: attendants ? attendants : [],
      }).save();
    return info;
  },
  addUserToCourse: async (parent, { courseID, studentID }) => {
    let info = await InfoModel.findOne({ courseID });
    let student = await UserModel.findOne({ studentID });
    info.attendants.push({ studentID, name: student.name });
    info.save();
    return info.attendants;
  },
  createUser: async (parent, { name, studentID, passwd, groupNum }) => {
    let user = await UserModel.findOne({ studentID: studentID });
    if (!user)
      user = await new UserModel({
        name: name,
        studentID: studentID,
        passwd: passwd,
        groupNum: groupNum,
        login: true,
        chatbox: [],
      }).save();
    return user;
  },
  login: async (parent, { studentID, passwd }) => {
    let user = await UserModel.findOne({
      studentID: studentID,
      passwd: passwd,
    });
    if (!user) {
      user = await UserModel.findOne({ login: false });
      if (!user) user = await new UserModel({ login: false }).save();
    }
    return user;
  },
  createSyllabus: async (parent, { weekNum, outline }) => {
    let syllabus = await SyllabusModel.findOne({ weekNum: weekNum });
    if (!syllabus)
      syllabus = await new SyllabusModel({
        weekNum: weekNum,
        outline: outline,
      }).save();
    return syllabus;
  },
  createFile: async (parent, { type, info, fileName, fileLink }) => {
    let file = await FileModel.findOne({
      type: type,
      info: info,
      fileName: fileName,
      fileLink: fileLink,
    });
    if (!file) {
      file = await new FileModel({
        type: type,
        info: info,
        fileName: fileName,
        fileLink: fileLink,
      }).save();
      if (type == "weekNum") {
        let syllabus = await SyllabusModel.findOne({ weekNum: info });
        let newFile = {
          type: type,
          info: info,
          fileName: fileName,
          fileLink: fileLink,
        };
        syllabus.file.push(newFile);
        await syllabus.save();
      }
    }
    return file;
  },
  createAnnouncement: async (parent, { time, title, content }) => {
    let announcement = await AnnouncementModel.findOne({
      time: time,
      title: title,
      content: content,
    });
    if (!announcement)
      announcement = await new AnnouncementModel({
        time: time,
        title: title,
        content: content,
      }).save();
    return announcement;
  },
  createGrade: async (
    parent,
    { studentID, subject, itemName, type, score, weight }
  ) => {
    let grade = await GradeModel.findOne({
      studentID: studentID,
      subject: subject,
      itemName: itemName,
    });
    if (!grade)
      grade = await new GradeModel({
        studentID: studentID,
        subject: subject,
        itemName: itemName,
        type: type,
        score: score,
        weight: weight,
      }).save();
    return grade;
  },
  createChatBox: async (parent, { name, courseID, participants }) => {
    const box = await new ChatBoxModel({
      name,
      courseID,
      participants,
      messages: [],
    }).save();
    let showName = participants.length > 2 ? name : "";
    participants?.forEach(async (person) => {
      const p = await UserModel.findOne({ studentID: person });
      if (!showName) {
        showName = participants.filter((p) => p.studentID !== person)[0];
      }
      p.chatbox.push({ name, courseID, showName });
      await p.save();
    });
    return box;
  },
  createMessage: async (parent, { sender, to, body, courseID }, { pubsub }) => {
    const chatBox = await ChatBoxModel.findOne({ name: to, courseID });
    const newMsg = { sender, body };
    chatBox.messages.push(newMsg);
    await chatBox.save();
    //const chatBoxName = makeName(name, to);
    pubsub.publish(`chatBox ${to}`, { message: newMsg });
    return newMsg;
  },
};
export default Mutation;
