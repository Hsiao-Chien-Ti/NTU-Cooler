import { gql } from "@apollo/client";

export const INFO_QUERY = gql`
  query info($courseID: String!) {
    info(courseID: $courseID) {
      name
      attendants {
        name
        studentID
      }
      courseID
    }
  }
`;

export const CHATBOX_OF_USER_QUERY = gql`
  query userChatbox($studentID: String!, $courseID: String!) {
    userChatbox(studentID: $studentID, courseID: $courseID) {
      chatboxes {
        name
      }
    }
  }
`;
export const SYLLABUS_QUERY = gql`
  query {
    syllabus {
      weekNum
      outline
      file {
        fileName
        fileLink
      }
    }
  }
`;
export const ANNOUNCEMENT_QUERY = gql`
  query {
    announcement {
      time
      title
      content
    }
  }
`;

export const GRADE_QUERY = gql`
  query grade($studentID: String!, $subject: String!) {
    grade(studentID: $studentID, subject: $subject) {
      studentID
      subject
      itemName
      type
      score
      weight
    }
  }
`;

export const CHATBOX_QUERY = gql`
  query chatBox($name: String!, $courseID: String!, $studentID: String!) {
    chatbox(name: $name, courseID: $courseID, studentID: $studentID) {
      name
      messages {
        sender
        body
      }
      type
      courseID
      notAccess
      pinMsg
      participants
    }
  }
`;
