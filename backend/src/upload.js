import ChatBoxModel from "./models/chatbox";
import InfoModel from "./models/info";
import UserModel from "./models/user";
import SyllabusModel from "./models/syllabus";
import AnnouncementModel from "./models/announcement";
import FileModel from "./models/file";
import GradeModel from "./models/grade";

const testUser = [
  {
    name: "t",
    studentID: "t",
    chatbox: [
      { name: "My Group", courseID: "EE1234", showName: "My Group" },
    ],
    passwd: "t",
    groupNum: 7,
    isTeacher: true,
  },
  {
    name: "KKK",
    studentID: "KKK",
    chatbox: [
      { name: "My Group", courseID: "EE1234", showName: "My Group" },
      { name: "KKK_q", courseID: "EE1234", showName: "q" },
    ],
    passwd: "7",
    groupNum: 7,
    isTeacher: true,
  },
  {
    name: "yzl",
    studentID: "b09901042",
    chatbox: [{ name: "My Group", courseID: "EE1234", showName: "My Group" }],
    passwd: "7",
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
    passwd: "7",
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
        sender: "KKK",
        groupNum: 7,
        body: "hi q",
        hidden: false,
      },
      {
        sender: "q",
        groupMum: 7,
        body: "hi buddy",
        hidden: false,
      },
      {
        sender: "KKK",
        groupNum: 7,
        body: "how's your day",
        hidden: false,
      },
      {
        sender: "q",
        groupNum: 7,
        body: "so fucked",
        hidden: false,
      },
      {
        sender: "q",
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
        sender: "KKK",
        groupNum: 7,
        body: "ans: 1",
        hidden: true,
      },
      {
        sender: "q",
        groupNum: 7,
        body: "ans: 2",
        hidden: true,
      },
      {
        sender: "KKK",
        groupNum: 7,
        body: "ans: 3",
        hidden: true,
      },
      {
        sender: "q",
        groupNum: 7,
        body: "ans: 4",
        hidden: true,
      },
      {
        sender: "q",
        groupNum: 7,
        body: "ans: 5",
        hidden: true,
      },
    ],
    participants: ["KKK", "q", "b09901042", "t"],
    type: true,
    courseID: "EE1234",
    pinMsg: 2,
  },
];

const testInfo = [
  {
    attendants: [
      { name: "KKK", studentID: "KKK" },
      { name: "q", studentID: "q" },
      { name: "yzl", studentID: "b09901042" },
    ],
    name: "ICN",
    courseID: "EE1234",
  },
];

const testSyllabus = [
  {
    weekNum: "1",
    outline: "No class for week 1",
    file: [{ fileName: "CPBL", fileLink: "https://www.cpbl.com.tw/" }]
  },
  {
    weekNum: "2",
    outline: "Field trip",
    file: [{ fileName: "Taipei children's amusement park", fileLink: "https://www.tcap.taipei/" }]
  }
]
const testFile = [
  {
    type: "weekNum",
    info: "1",
    fileName: "CPBL",
    fileLink: "https://www.cpbl.com.tw/"
  },
  {
    type: "weekNum",
    info: "2",
    fileName: "Taipei children's amusement park",
    fileLink: "https://www.tcap.taipei/"
  },
  {
    type: "HW",
    info: "1",
    fileName: "Leetcode",
    fileLink: "https://leetcode.com/problemset/all/"
  },
]
const testAnnouncement = [
  {
    time: "2023-1-1 0:0:0",
    title: "Happy new year",
    content: "Firework!!!!!"
  },
  {
    time: "2023-1-2 10:22:52",
    title: "Good Morning",
    content: "I am hungry"
  }
]
const testGrade = [
  {
    studentID:"b09901042",
    subject:"Introduction to Computer Network",
    itemName:"exam 1",
    score:100,
    weight:0.2
  },
  {
    studentID:"b09901008",
    subject:"Introduction to Computer Network",
    itemName:"exam 1",
    score:100,
    weight:0.2
  },
  {
    studentID:"t",
    subject:"Introduction to Computer Network",
    itemName:"exam 1",
    score:70,
    weight:0.2
  },
]
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
  
  console.log("Database initialized!");
};

export { dataInit };
