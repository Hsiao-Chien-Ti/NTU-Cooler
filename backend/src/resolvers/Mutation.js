import UserModel from "../models/user";
import SyllabusModel from "../models/syllabus";
import FileModel from "../models/file";
import AnnouncementModel from "../models/announcement";
import GradeModel from "../models/grade";
import ChatBoxModel from "../models/chatbox";
import InfoModel from "../models/info";
import bcrypt from 'bcrypt'
const Mutation = {
  createSyllabus: async (parent, { weekNum, outline }, { pubsub }) => {
    let syllabus = await SyllabusModel.findOne({ weekNum: weekNum });
    if (syllabus) {
      syllabus = await SyllabusModel.updateOne({ weekNum: weekNum }, { $set: { outline: outline } });
      syllabus = await SyllabusModel.findOne({ weekNum: weekNum });
    }
    else
      syllabus = await new SyllabusModel({ weekNum: weekNum, outline: outline, file: [] }).save();
    pubsub.publish('SYLLABUS', {
      syllabus: {
        weekNum: syllabus.weekNum,
        outline: syllabus.outline,
        file: syllabus.file
      }
    })
    return syllabus
  },
  createFile: async (parent, { type, info, fileName, fileLink, linkType }, { pubsub }) => {
    // console.log(type)
    let file = await FileModel.findOne({ type: type, info: info, fileName: fileName })
    if (file) {
      await FileModel.updateOne({ type: type, info: info, fileName: fileName }, { $set: { fileLink: fileLink, linkType: linkType } })
      file = await FileModel.findOne({ type: type, info: info, fileName: fileName })
    }
    else {
      file = await new FileModel({ type: type, info: info, fileName: fileName, fileLink: fileLink, linkType: linkType }).save()
    }
    // console.log(file)
    if (type == "weekNum") {
      let syllabus = await SyllabusModel.findOne({ weekNum: info });
      if (!syllabus)
        syllabus = await new SyllabusModel({ weekNum: info, outline: "", file: [] }).save();

      let newFile = { type: type, info: info, fileName: fileName, fileLink: fileLink, linkType: linkType }
      syllabus.file = syllabus.file.filter((f) => f.fileName !== fileName)
      console.log(syllabus.file)
      syllabus.file.push(newFile)
      await syllabus.save()
      pubsub.publish('SYLLABUS', {
        syllabus: {
          weekNum: syllabus.weekNum,
          outline: syllabus.outline,
          file: syllabus.file
        }
      })
    }

    pubsub.publish('FILE', {
      file: {
        type: type,
        info: info,
        fileName: fileName,
        fileLink: fileLink,
        linkType: linkType
      }
    })
    return file
  },
  createAnnouncement: async (parent, { time, title, content }, { pubsub }) => {
    let announcement = await AnnouncementModel.findOne({ title: title });
    console.log(announcement)
    if (announcement) {
      await AnnouncementModel.updateOne({ title: title }, { $set: { time: time, content: content } });
      announcement = await AnnouncementModel.findOne({ title: title });
    }
    else
      announcement = await new AnnouncementModel({ time: time, title: title, content: content }).save();
    pubsub.publish('ANNOUNCEMENT', {
      announcement: {
        time: time,
        title: title,
        content: content
      }
    })
    return announcement
  },
  createGrade: async (parent, { studentID, subject, itemName, score, weight }, { pubsub }) => {
    let grade = await GradeModel.findOne({ studentID: studentID, subject: subject, itemName: itemName });
    if (grade) {
      await GradeModel.updateOne({ studentID: studentID, subject: subject, itemName: itemName }, { $set: { score: score, weight: weight } });
      grade = await GradeModel.findOne({ studentID: studentID, subject: subject, itemName: itemName });
    }
    else
      grade = await new GradeModel({ studentID: studentID, subject: subject, itemName: itemName, score: score, weight: weight }).save();
    pubsub.publish(`GRADE ${studentID + subject}`, {
      grade: {
        studentID: studentID,
        subject: subject,
        itemName: itemName,
        score: score,
        weight: weight
      }
    })
    return grade
  },
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
  createUser: async (
    parent,
    { name, studentID, passwd, groupNum, isTeacher }
  ) => {
    let user = await UserModel.findOne({ studentID: studentID });
    if (!user)
      user = await new UserModel({
        name: name,
        studentID: studentID,
        passwd: bcrypt.hashSync(passwd,14),
        groupNum: groupNum,
        login: true,
        isTeacher: isTeacher,
        chatbox: [],
      }).save();
    return user;
  },
  login: async (parent, { studentID, passwd }) => {
    let user = await UserModel.findOne({
      studentID: studentID
    });
    if (user) {
      const res=await bcrypt.compare(passwd,user.passwd)
      if(res)
      {
        user.login = true;
        await user.save();
      }
      else
      {
        user =await UserModel.findOne({login:false})
        if(!user)
          user = await new UserModel({ login: false }).save();
      }
    }
    else
    {
      user =await UserModel.findOne({login:false})
      if(!user)
        user = await new UserModel({ login: false }).save();
    }
    return user;
  },
  createChatBox: async (parent, { name, courseID, participants, type }) => {
    console.log(name, participants, type);
    let notAccess = type ? participants : [];
    participants?.forEach(async (person) => {
      const p = await UserModel.findOne({ studentID: person });
      //console.log(p);
      if (p.isTeacher && type)
        notAccess = notAccess.filter((pp) => pp !== p.studentID);
      let showName =
        participants.length > 2
          ? name
          : participants.filter((p) => p.studentID !== person)[0];
      p.chatbox.push({ name, courseID, showName });
      console.log(p.chatbox);
      await p.save();
    });
    const box = await new ChatBoxModel({
      name,
      courseID,
      participants,
      messages: [],
      notAccess,
      type,
      pinMsg: -1,
    }).save();
    return box;
  },
  createMessage: async (
    parent,
    { senderID, senderName, to, body, courseID },
    { pubsub }
  ) => {
    const chatBox = await ChatBoxModel.findOne({ name: to, courseID });
    const newMsg = {
      sender: { studentID: senderID, name: senderName },
      body,
      groupnum: -1,
      hidden: chatBox.type,
    };
    chatBox.messages.push(newMsg);
    console.log(chatBox.notAccess);
    console.log(senderID);
    if (chatBox.notAccess.includes(senderID)) {
      const notAccess = chatBox.notAccess.filter((s) => s !== senderID);
      chatBox.notAccess = notAccess;
      console.log(chatBox.notAccess);
    }
    try {
      await chatBox.save();
    } catch (e) {
      throw new Error(e);
    }
    //const chatBoxName = makeName(name, to);
    pubsub.publish(`chatBox ${to} in class ${courseID}`, { message: newMsg });
    return newMsg;
  },
};
export default Mutation;
