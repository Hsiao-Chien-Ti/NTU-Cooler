import { gql } from "@apollo/client";

const CREATE_INFO_MUTATION = gql`
  mutation createInfo($name: String, $courseID: String!) {
    createInfo(name: $name, courseID: $courseID) {
      name
      courseID
      attendants
    }
  }
`;
const CREATE_USER_MUTATION = gql`
  mutation createUser(
    $name: String!
    $studentID: String!
    $passwd: String!
    $groupNum: Int
  ) {
    createUser(
      name: $name
      studentID: $studentID
      passwd: $passwd
      groupNum: $groupNum
    ) {
      name
      studentID
      groupNum
    }
  }
`;
const LOGIN_MUTATION = gql`
  mutation login($studentID: String!, $passwd: String!) {
    login(studentID: $studentID, passwd: $passwd) {
      name
      studentID
      groupNum
      login
    }
  }
`;
const CREATE_SYLLABUS_MUTATION = gql`
  mutation createSyllabus(
    $weekNum: String!
    $outline: String
    $fileName: String
    $fileLink: String
  ) {
    createSyllabus(
      weekNum: $weekNum
      outline: $outline
      fileName: $fileName
      fileLink: $fileLink
    ) {
      weekNum
      outline
      file {
        fileName
        fileLink
      }
    }
  }
`;
const CREATE_FILE_MUTATION = gql`
  mutation createFile(
    $type: String!
    $info: String!
    $fileName: String!
    $fileLink: String!
  ) {
    createFile(
      type: $type
      info: $info
      fileName: $fileName
      fileLink: $fileLink
    ) {
      type
      info
      fileName
      fileLink
    }
  }
`;
const CREATE_ANNOUNCEMENT_MUTATION = gql`
  mutation createAnnouncement(
    $time: String!
    $title: String!
    $content: String
  ) {
    createAnnouncement(time: $time, title: $title, content: $content) {
      time
      title
      content
    }
  }
`;
const CREATE_GRADE_MUTATION = gql`
  mutation createGrade(
    $studentID: String!
    $subject: String!
    $itemName: String!
    $type: Boolean!
    $score: Float!
    $weight: Float
  ) {
    studentID
    subject
    itemName
    type
    score
    weight
  }
`;

const CREATE_CHATBOX_MUTATION = gql`
  mutation createChatBox(
    $name: String!
    $courseID: String!
    $participants: [String]
  ) {
    createChatBox(
      name: $name
      courseID: $courseID
      participants: $participants
    ) {
      name
      courseID
      participants
      messages {
        sender
        body
      }
    }
  }
`;

const CREATE_MESSAGE_MUTATION = gql`
  mutation createMessage(
    $sender: String!
    $to: String!
    $body: String!
    $courseID: String!
  ) {
    createMessage(sender: $sender, to: $to, body: $body, courseID: $courseID) {
      sender
      body
    }
  }
`;

export {
  CREATE_INFO_MUTATION,
  CREATE_MESSAGE_MUTATION,
  CREATE_CHATBOX_MUTATION,
  CREATE_GRADE_MUTATION,
  CREATE_ANNOUNCEMENT_MUTATION,
  CREATE_FILE_MUTATION,
  CREATE_USER_MUTATION,
  LOGIN_MUTATION,
  CREATE_SYLLABUS_MUTATION,
};
