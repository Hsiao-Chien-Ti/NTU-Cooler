import ChatBoxModel from "./models/chatbox";
import InfoModel from "./models/info";
import UserModel from "./models/user";

const testUser = [
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
    participants: ["KKK", "q", "b09901042"],
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

const dataInit = async () => {
  await UserModel.deleteMany({});
  await UserModel.insertMany(testUser);
  await InfoModel.deleteMany({});
  await InfoModel.insertMany(testInfo);
  await ChatBoxModel.deleteMany({});
  await ChatBoxModel.insertMany(testChat);
  console.log("Database initialized!");
};

export { dataInit };
