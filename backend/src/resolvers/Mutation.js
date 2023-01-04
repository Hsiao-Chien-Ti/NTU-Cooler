import UserModel from "../models/user";
import SyllabusModel from "../models/syllabus";
import FileModel from "../models/file";
import AnnouncementModel from "../models/announcement";
import GradeModel from "../models/grade";
import ChatBoxModel from "../models/chatbox";
import InfoModel from "../models/info";
import HWModel from "../models/hw";
import bcrypt from "bcrypt";
import QuizModel from "../models/quiz";
const Mutation = {
  createSyllabus: async (parent, { weekNum, outline }, { pubsub }) => {
    let syllabus = await SyllabusModel.findOne({ weekNum: weekNum });
    if (syllabus) {
      syllabus = await SyllabusModel.updateOne(
        { weekNum: weekNum },
        { $set: { outline: outline } }
      );
      syllabus = await SyllabusModel.findOne({ weekNum: weekNum });
    } else
      syllabus = await new SyllabusModel({
        weekNum: weekNum,
        outline: outline,
        file: [],
      }).save();
    pubsub.publish("SYLLABUS", {
      syllabus: {
        weekNum: syllabus.weekNum,
        outline: syllabus.outline,
        file: await syllabus.populate("file"),
      },
    });
    return syllabus;
  },
  createFile: async (
    parent,
    { type, info, fileName, fileLink, linkType, studentID, firstFlag },
    { pubsub }
  ) => {
    // console.log(type)
    let file = await FileModel.findOne({
      type: type,
      info: info,
      fileName: fileName,
    });
    if (file) {
      await FileModel.updateOne(
        { type: type, info: info, fileName: fileName },
        { $set: { fileLink: fileLink, linkType: linkType } }
      );
      file = await FileModel.findOne({
        type: type,
        info: info,
        fileName: fileName,
      });
    } else {
      file = await new FileModel({
        type: type,
        info: info,
        fileName: fileName,
        fileLink: fileLink,
        linkType: linkType,
      }).save();
    }
    if (type == "weekNum") {
      let syllabus = await SyllabusModel.findOne({ weekNum: info });
      if (!syllabus)
        syllabus = await new SyllabusModel({
          weekNum: info,
          outline: "",
          file: [],
        }).save();
      syllabus.file = syllabus.file.filter(
        (f) => JSON.stringify(f) !== JSON.stringify(file._id)
      );
      syllabus.file.push(file);
      await syllabus.save();
      const sf = await syllabus.populate("file");
      pubsub.publish("SYLLABUS", {
        syllabus: {
          weekNum: sf.weekNum,
          outline: sf.outline,
          file: sf.file,
        },
      });
    } else if (type == "tHW") {
      let hw = await HWModel.findOne({ title: info });
      if (!hw)
        hw = await new HWModel({
          title: info,
          deadline: "not set",
          description: "",
          sfile: [],
          tFile: [],
        }).save();
      hw.tFile = hw.tFile.filter(
        (f) => JSON.stringify(f) !== JSON.stringify(file._id)
      );
      hw.tFile.push(file);
      await hw.save();
      const hf = await hw.populate(["tFile", "sFile.file"]);
      pubsub.publish("HW", {
        hw: {
          title: hf.title,
          deadline: hf.deadline,
          description: hf.description,
          tFile: hf.tFile,
          sFile: hf.sFile,
        },
      });
    } else if (type == "sHW") {
      let hw = await HWModel.findOne({ title: info });
      if (firstFlag)
        hw.sFile = hw.sFile.filter((f) => f.studentID !== studentID);
      hw.sFile.push({ studentID: studentID, file: file });
      await hw.save();
      const hf = await hw.populate(["tFile", "sFile.file"]);
      console.log("cf" + hf);
      pubsub.publish("HW", {
        hw: {
          title: hf.title,
          deadline: hf.deadline,
          description: hf.description,
          tFile: hf.tFile,
          sFile: hf.sFile,
        },
      });
    }

    pubsub.publish("FILE", {
      file: {
        type: type,
        info: info,
        fileName: fileName,
        fileLink: fileLink,
        linkType: linkType,
      },
    });
    return file;
  },
  createAnnouncement: async (parent, { time, title, content }, { pubsub }) => {
    let announcement = await AnnouncementModel.findOne({ title: title });
    console.log(announcement);
    if (announcement) {
      await AnnouncementModel.updateOne(
        { title: title },
        { $set: { time: time, content: content } }
      );
      announcement = await AnnouncementModel.findOne({ title: title });
    } else
      announcement = await new AnnouncementModel({
        time: time,
        title: title,
        content: content,
      }).save();
    pubsub.publish("ANNOUNCEMENT", {
      announcement: {
        time: time,
        title: title,
        content: content,
      },
    });
    return announcement;
  },
  createHW: async (parent, { title, deadline, description }, { pubsub }) => {
    let hw = await HWModel.findOne({ title: title });
    console.log(hw);
    if (hw) {
      await HWModel.updateOne(
        { title: title },
        { $set: { deadline: deadline, description: description } }
      );
      hw = await HWModel.findOne({ title: title });
    } else
      hw = await new HWModel({
        title: title,
        deadline: deadline,
        description: description,
        tFile: [],
        sFile: [],
      }).save();
    console.log("chw" + hw);
    const hf = await hw.populate(["tFile", ["sFile", "file"]]);
    // console.log(hf)
    pubsub.publish("HW", {
      hw: {
        title: hf.title,
        deadline: hf.deadline,
        description: hf.description,
        tFile: hf.tFile,
        sFile: hf.sFile,
      },
    });
    return hw;
  },
  createGrade: async (
    parent,
    { studentID, subject, itemName, score, weight },
    { pubsub }
  ) => {
    let grade = await GradeModel.findOne({
      studentID: studentID,
      subject: subject,
      itemName: itemName,
    });
    if (grade) {
      await GradeModel.updateOne(
        { studentID: studentID, subject: subject, itemName: itemName },
        { $set: { score: score, weight: weight } }
      );
      grade = await GradeModel.findOne({
        studentID: studentID,
        subject: subject,
        itemName: itemName,
      });
    } else
      grade = await new GradeModel({
        studentID: studentID,
        subject: subject,
        itemName: itemName,
        score: score,
        weight: weight,
      }).save();
    pubsub.publish(`GRADE ${studentID + subject}`, {
      grade: {
        studentID: studentID,
        subject: subject,
        itemName: itemName,
        score: score,
        weight: weight,
      },
    });
    return grade;
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
        passwd: bcrypt.hashSync(passwd, 14),
        groupNum: groupNum,
        login: true,
        isTeacher: isTeacher,
        chatbox: [],
      }).save();
    return user;
  },
  login: async (parent, { studentID, passwd }) => {
    let user = await UserModel.findOne({
      studentID: studentID,
    });
    if (user) {
      const res = await bcrypt.compare(passwd, user.passwd);
      if (res) {
        user.login = true;
        await user.save();
      } else {
        user = await UserModel.findOne({ login: false });
        if (!user) user = await new UserModel({ login: false }).save();
      }
    } else {
      user = await UserModel.findOne({ login: false });
      if (!user) user = await new UserModel({ login: false }).save();
    }
    return user;
  },
  createChatBox: async (
    parent,
    { name, courseID, participants, type },
    { pubsub }
  ) => {
    const findBox = await ChatBoxModel.findOne({ name, courseID, type });
    if (findBox) {
      throw new Error(
        `Box with name ${name} in class ${courseID} of type ${type} alreay exists!`
      );
    } else {
      let notAccess = type ? participants : [];
      participants?.forEach(async (person) => {
        const p = await UserModel.findOne({ studentID: person });
        //console.log(p);
        if (p.isTeacher && type)
          notAccess = notAccess.filter((pp) => pp !== p.studentID);
        let showName =
          participants.length > 2
            ? name
            : participants.filter((pp) => pp !== person)[0];
        console.log(showName, name, person);
        p.chatbox.push({ name, courseID, showName, type });
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
      pubsub.publish(`new chatbox in class ${courseID}`, { chatbox: box });

      return box;
    }
  },
  createMessage: async (
    parent,
    { senderID, senderName, to, body, courseID, groupNum },
    { pubsub }
  ) => {
    const chatBox = await ChatBoxModel.findOne({ name: to, courseID });
    const newMsg = {
      sender: { studentID: senderID, name: senderName },
      body,
      groupNum: groupNum ? groupNum : -1,
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
  changePin: async (
    parent,
    { name, courseID, pinMsg, studentID },
    { pubsub }
  ) => {
    try {
      const box = await ChatBoxModel.findOne({ name, courseID, studentID });
      box.pinMsg = pinMsg;
      await box.save();
      pubsub.subscribe(`chatBox ${name} in class ${courseID} be modified`, {
        chatbox: box,
      });
      return box;
    } catch (e) {
      throw new Error("change pin error", e);
    }
  },
  createQuiz: async (
    parent,
    { progress, groupShow, courseID, students, teachers, name, question },
    { pubsub }
  ) => {
    let box = await ChatBoxModel.findOne({ name, courseID, type: true });
    if (box) {
      throw new Error(`quiz ${name} existed in class ${courseID}`);
    } else {
      const participants = [...students, ...teachers];
      box = await new ChatBoxModel({
        name,
        courseID,
        participants,
        messages: [],
        notAccess: students,
        type: true,
        pinMsg: progress === "open" ? 0 : -1,
      }).save();
      participants?.forEach(async (person) => {
        const p = await UserModel.findOne({ studentID: person });
        p.chatbox.push({ name, courseID, showName: name, type: true });
        await p.save();
      });
      if (question) {
        box.messages.push({
          sender: { studentID: "QUESTION", name: "Q:" },
          body: question,
          groupnum: 0,
          hidden: false,
        });
      }
      await box.save();
      const quiz = await new QuizModel({
        chatbox: box._id,
        groupShow,
        progress,
      }).save();
      // pubsub.subscribe(`new quiz ${name} in class ${courseID} been created`, {

      // },
      return quiz;
    }
  },
};
export default Mutation;
