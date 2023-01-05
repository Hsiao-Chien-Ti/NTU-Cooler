import ChatBoxModel from "./models/chatbox";
import InfoModel from "./models/info";
import UserModel from "./models/user";
import SyllabusModel from "./models/syllabus";
import AnnouncementModel from "./models/announcement";
import FileModel from "./models/file";
import GradeModel from "./models/grade";
import HWModel from "./models/hw";
import bcrypt from "bcrypt";
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
    name: "Adi",
    studentID: "b09901008",
    chatbox: [],
    passwd: bcrypt.hashSync("t", 14),
    groupNum: 7,
    isTeacher: false,
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
  {
    name: "Teacher",
    studentID: "teacher",
    chatbox: [
      { name: "quiz 1", courseID: "EE1234", showName: "quiz 1", type: true },
    ],
    passwd: bcrypt.hashSync("12345678", 14),
    groupNum: 0,
    isTeacher: true,
  },
  {
    name: "Student",
    studentID: "student",
    chatbox: [
      {
        name: "NI_MEN_DA_ER",
        coursID: "EE1234",
        showName: "NI_MEN_DA_ER",
        type: false,
      },
      {
        name: "quiz 1",
        courseID: "EE1234",
        showName: "quiz 1",
        type: true
      },
    ],
    passwd: bcrypt.hashSync("87654321", 14),
    groupNum: 3,
    isTeacher: false,
  },
  {
    name: "qian",
    studentID: "pbwhere",
    passwd: "12345678",
    groupNum: 3,
    login: false,
    isTeacher: false,
    chatbox: [
      {
        name: "NI_MEN_DA_ER",
        coursID: "EE1234",
        showName: "NI_MEN_DA_ER",
        type: false,
      },
    ]
  },
  {
    name: "adi",
    studentID: "aaaaadi",
    passwd: "12345678",
    groupNum: 2,
    login: false,
    isTeacher: false,
    chatbox: [
      {
        name: "NI_MEN_DA_ER",
        coursID: "EE1234",
        showName: "NI_MEN_DA_ER",
        type: false,
      },
    ]
  },
  {
    name: "angel",
    studentID: "hsiaYuTien",
    passwd: "12345678",
    groupNum: 6,
    login: false,
    isTeacher: false,
    chatbox: [
      {
        name: "NI_MEN_DA_ER",
        coursID: "EE1234",
        showName: "NI_MEN_DA_ER",
        type: false,
      },
    ]
  },
  {
    name: "shootingStar",
    studentID: "heartUniverse113",
    passwd: "12345678",
    groupNum: 2,
    login: false,
    isTeacher: false,
    chatbox: [
      {
        name: "NI_MEN_DA_ER",
        coursID: "EE1234",
        showName: "NI_MEN_DA_ER",
        type: false,
      },
    ]
  },
  {
    name: "frenchfries",
    studentID: "potatolove23",
    passwd: "12345678",
    groupNum: 4,
    login: false,
    isTeacher: false,
    chatbox: [
      {
        name: "NI_MEN_DA_ER",
        coursID: "EE1234",
        showName: "NI_MEN_DA_ER",
        type: false,
      },
    ]
  },
];

const testChat = [
  {
    name: "quiz 1",
    notAccess: ["b09901042", "student"],
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
    participants: ["KKK", "q", "b09901042", "t", "student"],
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
  {
    type: false,
    courseID: "EE1234",
    name: "NI_MEN_DA_ER",
    notAccess: [],
    messages: [
      {
        sender: {
          studentID: "student",
          name: "Student",
          groupNum: -1,
        },
        body: "hi 大家好呀",
        hidden: false,
      },
      {
        sender: {
          studentID: "aaaaadi",
          name: "adi",
          groupNum: -1,
        },
        body: "要不要打球",
        hidden: false,
      },
      {
        sender: {
          studentID: "hsiaYuTien",
          name: "angel",
          groupNum: -1,
        },
        body: "走",
        hidden: false,
      },
      {
        sender: {
          studentID: "heartUniverse113",
          name: "shootingStar",
          groupNum: -1,
        },
        body: "明天好像會下雨",
        hidden: false,
      },
      {
        sender: {
          studentID: "aaaaadi",
          name: "adi",
          groupNum: -1,
        },
        body: "還是去打保齡球",
        hidden: false,
      },
      {
        sender: {
          studentID: "KKK",
          name: "KKK",
          groupNum: -1,
        },
        body: "加加",
        hidden: false,
      },
      {
        sender: {
          studentID: "aaaaadi",
          name: "adi",
          groupNum: -1,
        },
        body: "明天早上十點劍潭站集合",
        hidden: false,
      },
      {
        sender: {
          studentID: "potatolove23",
          name: "frenchfries",
          groupNum: -1,
        },
        body: "要等我喔",
        hidden: false,
      },
      {
        sender: {
          studentID: "pbwhere",
          name: "qian",
          groupNum: -1,
        },
        body: "你會遲到",
        hidden: false,
      },
      {
        sender: {
          studentID: "potatolove23",
          name: "frenchfries",
          groupNum: -1,
        },
        body: "這樣子講話的=(",
        hidden: false,
      },
    ],
    pinMsg: 6,
    participants: ["student", "pbwhere", "KKK", "potatolove23", "heartUniverse113", "hsiaYuTien", "aaaaadi"]
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
      { name: "Adi", studentID: "b09901008", isTeacher: false },
    ],
    name: "ICN",
    courseID: "EE1234",
  },
];

const testSyllabus = [
  {
    weekNum: "1",
    outline: "Introduction to the structure of network",
  },
  {
    weekNum: "2",
    outline: "network core",
  },
  {
    weekNum: "3",
    outline: "packet loss in network",
  },
  {
    weekNum: "4",
    outline: "TCP and UDP",
  },
  {
    weekNum: "5",
    outline: "HTTP and DNS",
  },
  {
    weekNum: "6",
    outline: "IP datagram",
  },
];
const testFile = [
  {
    type: "weekNum",
    info: "1",
    fileName: "What is network layer?",
    fileLink: "https://www.cloudflare.com/zh-tw/learning/network-layer/what-is-the-network-layer/",
    linkType: false,
    studentID: "",
  },
  {
    type: "weekNum",
    info: "6",
    fileName: "What is my ip",
    fileLink: "https://www.whatismyip.com.tw/tw/",
    linkType: false,
    studentID: "",
  },
  {
    type: "tHW",
    info: "PA1",
    fileName: "Golang",
    fileLink: "https://go.dev/",
    linkType: false,
    studentID: "",
  },
  {
    type: "tHW",
    info: "PA2",
    fileName: "goroutine",
    fileLink: "https://go.dev/tour/concurrency/1",
    linkType: false,
  },
];
const testHW = [
  {
    title: "hw1",
    deadline: "2022-10-06 23:59",
    description: "This is your first homework",
  },
  {
    title: "hw2",
    deadline: "2023-11-07 08:00",
    description: "This is your second homework",
  },
  {
    title: "PA1",
    deadline: "2022-12-04 10:20",
    description: "First meet with Golang",
  },
  {
    title: "hw3",
    deadline: "2022-12-17 23:59",
    description: "DV and LS practice",
  },
  {
    title: "PA2",
    deadline: "2023-01-04 10:20",
    description: "Goroutine",
  },
];
const testAnnouncement = [
  {
    time: "2022-12-31 13:16",
    title: "Happy new year",
    content: "Enjoy the firework show!!!!! BUT Don't forget to prepare for the upcoming exam!!!",
  },
  {
    time: "2023-01-05 01:01",
    title: "Postpone of Exam 3",
    content: "Due to our delay on the course syllabus, the exam will be postponed for two weeks",
  },
  {
    time: "2023-02-05 12:00",
    title: "Lantern Festival",
    content: "Don't forget to eat yuanxiao!!!",
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
  const quitChat = await ChatBoxModel.findOne({ name: "quiz 1" });
  testQuiz[0][`chatbox`] = quitChat._id;
  await QuizModel.deleteMany({});
  await QuizModel.insertMany(testQuiz);
  await AnnouncementModel.deleteMany({});
  await AnnouncementModel.insertMany(testAnnouncement);
  await GradeModel.deleteMany({});
  await GradeModel.insertMany(testGrade);
  await HWModel.deleteMany({});
  await HWModel.insertMany(testHW);
  const files = await FileModel.find({});
  const asyncRes = await Promise.all(
    files.map(async (f) => {
      if (f.type === "weekNum") {
        const syllabus = await SyllabusModel.findOne({ weekNum: f.info });
        syllabus.file.push(f._id);
        await syllabus.save();
      }
      if (f.type === "tHW") {
        const tHW = await HWModel.findOne({ title: f.info });
        tHW.tFile.push(f._id);
        await tHW.save();
      }
    })
  );

  console.log("Database initialized!");
};

export { dataInit };
