import ChatBoxModel from "./models/chatbox";
import InfoModel from "./models/info";
import UserModel from "./models/user";
import SyllabusModel from "./models/syllabus";
import AnnouncementModel from "./models/announcement";
import FileModel from "./models/file";
import GradeModel from "./models/grade";
import HWModel from "./models/hw";
import bcrypt from 'bcrypt'

const testUser = [
  {
    name: "t",
    studentID: "t",
    chatbox: [{ name: "My Group", courseID: "EE1234", showName: "My Group" }],
    passwd: bcrypt.hashSync("t", 14),
    groupNum: 7,
    isTeacher: true,
  },
  {
    name: "Adi",
    studentID: "b09901008",
    chatbox: [{ name: "My Group", courseID: "EE1234", showName: "My Group" }],
    passwd: bcrypt.hashSync("t", 14),
    groupNum: 7,
    isTeacher: false,
  },
  {
    name: "KKK",
    studentID: "KKK",
    chatbox: [
      { name: "My Group", courseID: "EE1234", showName: "My Group" },
      { name: "KKK_q", courseID: "EE1234", showName: "q" },
    ],
    passwd: bcrypt.hashSync("7", 14),
    groupNum: 7,
    isTeacher: true,
  },
  {
    name: "yzl",
    studentID: "b09901042",
    chatbox: [{ name: "My Group", courseID: "EE1234", showName: "My Group" }],
    passwd: bcrypt.hashSync("7", 14),
    groupNum: 7,
    isTeacher: false,
  },
  {
    name: "q",
    studentID: "q",
    chatbox: [
      { name: "My Group", courseID: "EE1234", showName: "My Group" },
      { name: "KKK_q", courseID: "EE1234", showName: "K" },
    ],
    passwd: bcrypt.hashSync("7", 14),
    groupNum: 7,
    isTeacher: false,
  },
];

const testChat = [
  {
    name: "KKK_q",
    notAccess: [],
    messages: [
      {
        sender: { studentID: "KKK", name: "KKK" },
        groupNum: 7,
        body: "hi q",
        hidden: false,
      },
      {
        sender: { studentID: "q", name: "q" },
        groupMum: 7,
        body: "hi buddy",
        hidden: false,
      },
      {
        sender: { studentID: "KKK", name: "KKK" },
        groupNum: 7,
        body: "how's your day",
        hidden: false,
      },
      {
        sender: { studentID: "q", name: "q" },
        groupNum: 7,
        body: "so fucked",
        hidden: false,
      },
      {
        sender: { studentID: "q", name: "q" },
        groupNum: 7,
        body: "but finally it's all finished",
        hidden: false,
      },
    ],
    participants: ["KKK", "q"],
    type: false,
    courseID: "EE1234",
    pinMsg: -1,
  },
  {
    name: "My Group",
    notAccess: ["b09901042"],
    messages: [
      {
        sender: { studentID: "KKK", name: "KKK" },
        groupNum: 7,
        body: "ans: 1",
        hidden: true,
      },
      {
        sender: { studentID: "q", name: "q" },
        groupNum: 7,
        body: "ans: 2",
        hidden: true,
      },
      {
        sender: { studentID: "KKK", name: "KKK" },
        groupNum: 7,
        body: "ans: 3",
        hidden: true,
      },
      {
        sender: { studentID: "q", name: "q" },
        groupNum: 7,
        body: "ans: 4",
        hidden: true,
      },
      {
        sender: { studentID: "q", name: "q" },
        groupNum: 7,
        body: "ans: 5",
        hidden: true,
      },
    ],
    participants: ["KKK", "q", "b09901042", "t","b09901008"],
    type: true,
    courseID: "EE1234",
    pinMsg: 2,
  },
];

const testInfo = [
  {
    attendants: [
      { name: "KKK", studentID: "KKK", isTeacher: true },
      { name: "q", studentID: "q", isTeacher: false },
      { name: "yzl", studentID: "b09901042", isTeacher: false },
      { name: "t", studentID: "t", isTeacher: true },
      { name: "Adi", studentID: "b09901008", isTeacher: false },
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
  }
]
const testFile = [
  {
    type: "weekNum",
    info: "1",
    fileName: "CPBL",
    fileLink: "https://www.cpbl.com.tw/",
    linkType: false,
    studentID: ""
  },
  {
    type: "weekNum",
    info: "2",
    fileName: "Taipei children's amusement park",
    fileLink: "https://www.tcap.taipei/",
    linkType: false,
    studentID: ""
  },
  {
    type: "tHW",
    info: "hw1",
    fileName: "Leetcode",
    fileLink: "https://leetcode.com/problemset/all/",
    linkType: false,
    studentID: ""
  },
];
const testHW = [
  {
    title: "hw1",
    deadline: "2023-01-06 01:01",
    description: "This is your first homework"
  },
  {
    title: "hw2",
    deadline: "2023-01-07 01:01",
    description: "This is your second homework"
  }
]
const testAnnouncement = [
  {
    time: "2023-01-01 01:01",
    title: "Happy new year",
    content: "Firework!!!!!",
  },
  {
    time: "2023-01-05 01:01",
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
  await AnnouncementModel.deleteMany({});
  await AnnouncementModel.insertMany(testAnnouncement);
  await GradeModel.deleteMany({});
  await GradeModel.insertMany(testGrade);
  await HWModel.deleteMany({})
  await HWModel.insertMany(testHW)
  const files = await FileModel.find({});
  const asyncRes = await Promise.all(files.map(async (f) => {
    if (f.type === "weekNum") {
      const syllabus = await SyllabusModel.findOne({ weekNum: f.info })
      syllabus.file.push(f._id)
      await syllabus.save()
    }
    if (f.type==="tHW"){
      const tHW=await HWModel.findOne({title:f.info})
      tHW.tFile.push(f._id)
      await tHW.save()
    }
  }))


  console.log("Database initialized!");
};

export { dataInit };
