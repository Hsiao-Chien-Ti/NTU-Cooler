import ChatBoxModel from "./models/chatbox";
import InfoModel from "./models/info";
import UserModel from "./models/user";
import SyllabusModel from "./models/syllabus";
import AnnouncementModel from "./models/announcement";
import FileModel from "./models/file";
import GradeModel from "./models/grade";
import HWModel from "./models/hw";
import bcrypt from 'bcrypt'
import QuizModel from "./models/quiz";

const testUser = [
  {
    name: "t",
    studentID: "t",
    chatbox: [
      { name: "quiz 1", courseID: "EE1234", showName: "quiz 1", type: true },
    ],
    passwd: bcrypt.hashSync("t", 14),
    groupNum: 0,
    isTeacher: true,
  },
  {
    name: "KKK",
    studentID: "KKK",
    chatbox: [
      { name: "quiz 1", courseID: "EE1234", showName: "quiz 1", type: true },
      { name: "KKK_q", courseID: "EE1234", showName: "q", type: false },
    ],
    passwd: bcrypt.hashSync("7", 14),
    groupNum: 0,
    isTeacher: true,
  },
  {
    name: "yzl",
    studentID: "b09901042",
    chatbox: [
      { name: "quiz 1", courseID: "EE1234", showName: "quiz 1", type: true },
    ],
    passwd: bcrypt.hashSync("7", 14),
    groupNum: 7,
    isTeacher: false,
  },
  {
    name: "q",
    studentID: "q",
    chatbox: [
      { name: "quiz 1", courseID: "EE1234", showName: "quiz 1", type: true },
      { name: "KKK_q", courseID: "EE1234", showName: "K", type: false },
    ],
    passwd: bcrypt.hashSync("7", 14),
    groupNum: 7,
    isTeacher: false,
  },
];

const testChat = [
  {
    name: "quiz 1",
    notAccess: ["b09901042"],
    messages: [
      {
        sender: { studentID: "t", name: "t", groupNum: 0 },
        body: "problem: ur favorite number",
        hidden: false,
      },
      {
        sender: { studentID: "KKK", name: "KKK", groupNum: 0 },
        body: "ans: 1",
        hidden: true,
      },
      {
        sender: { studentID: "q", name: "q", groupNum: 7 },
        body: "ans: 2",
        hidden: true,
      },
      {
        sender: { studentID: "KKK", name: "KKK", groupNum: 0 },

        body: "ans: 3",
        hidden: true,
      },
      {
        sender: { studentID: "q", name: "q", groupNum: 7 },
        body: "ans: 4",
        hidden: true,
      },
      {
        sender: { studentID: "q", name: "q", groupNum: 7 },
        groupNum: 7,
        body: "ans: 5",
        hidden: true,
      },
    ],
    participants: ["KKK", "q", "b09901042", "t"],
    type: true,
    courseID: "EE1234",
    pinMsg: 0,
  },
  {
    name: "KKK_q",
    notAccess: [],
    messages: [
      {
        sender: { studentID: "KKK", groupNum: -1, name: "KKK" },
        body: "hi q",
        hidden: false,
      },
      {
        sender: { studentID: "q", groupNum: -1, name: "q" },
        body: "hi buddy",
        hidden: false,
      },
      {
        sender: { studentID: "KKK", groupNum: -1, name: "KKK" },
        body: "how's your day",
        hidden: false,
      },
      {
        sender: { studentID: "q", groupNum: -1, name: "q" },
        body: "so fucked",
        hidden: false,
      },
      {
        sender: { studentID: "q", groupNum: -1, name: "q" },
        body: "but finally it's all finished",
        hidden: false,
      },
    ],
    participants: ["KKK", "q"],
    type: false,
    courseID: "EE1234",
    pinMsg: -1,
  },
];

const testQuiz = [
  {
    progress: "open",
    groupShow: true,
  },
];
const testInfo = [
  {
    attendants: [
      { name: "KKK", studentID: "KKK", isTeacher: true },
      { name: "q", studentID: "q", isTeacher: false },
      { name: "yzl", studentID: "b09901042", isTeacher: false },
      { name: "t", studentID: "t", isTeacher: true },
    ],
    name: "ICN",
    courseID: "EE1234",
  },
];

const testSyllabus = [
  {
    weekNum: "1",
    outline: "No class for week 1",
  },
  {
    weekNum: "2",
    outline: "Field trip",
  },
];
const testFile = [
  {
    type: "weekNum",
    info: "1",
    fileName: "CPBL",
    fileLink: "https://www.cpbl.com.tw/",
    linkType: false,
    studentID: "",
  },
  {
    type: "weekNum",
    info: "2",
    fileName: "Taipei children's amusement park",
    fileLink: "https://www.tcap.taipei/",
    linkType: false,
    studentID: "",
  },
  {
    type: "HW",
    info: "1",
    fileName: "Leetcode",
    fileLink: "https://leetcode.com/problemset/all/",
    linkType: false,
    studentID: "",
  },
];
const testAnnouncement = [
  {
    time: "2023-1-1 0:0:0",
    title: "Happy new year",
    content: "Firework!!!!!",
  },
  {
    time: "2023-1-2 10:22:52",
    title: "Good Morning",
    content: "I am hungry",
  },
];
const testGrade = [
  {
    studentID: "b09901042",
    subject: "Introduction to Computer Network",
    itemName: "exam 1",
    score: 100,
    weight: 0.2,
  },
  {
    studentID: "b09901008",
    subject: "Introduction to Computer Network",
    itemName: "exam 1",
    score: 100,
    weight: 0.2,
  },
  {
    studentID: "t",
    subject: "Introduction to Computer Network",
    itemName: "exam 1",
    score: 70,
    weight: 0.2,
  },
];
const dataInit = async () => {
  await UserModel.deleteMany({});
  await UserModel.insertMany(testUser);
  await InfoModel.deleteMany({});
  await InfoModel.insertMany(testInfo);
  await ChatBoxModel.deleteMany({});
  await ChatBoxModel.insertMany(testChat);
  await SyllabusModel.deleteMany({});
  await SyllabusModel.insertMany(testSyllabus);
  await FileModel.deleteMany({});
  await FileModel.insertMany(testFile);

  const files = await FileModel.find({});
  const asyncRes = await Promise.all(
    files.map(async (f) => {
      if (f.type === "weekNum") {
        const syllabus = await SyllabusModel.findOne({ weekNum: f.info });
        syllabus.file.push(f._id);
        await syllabus.save();
      }
    })
  );

  const quitChat = await ChatBoxModel.findOne({ name: "quiz 1" });
  testQuiz[0][`chatbox`] = quitChat._id;
  await AnnouncementModel.deleteMany({});
  await AnnouncementModel.insertMany(testAnnouncement);
  await GradeModel.deleteMany({});
  await GradeModel.insertMany(testGrade);
  await HWModel.deleteMany({});
  await QuizModel.deleteMany({});
  await QuizModel.insertMany(testQuiz);

  console.log("Database initialized!");
};

export { dataInit };
