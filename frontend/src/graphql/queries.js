import { gql } from "@apollo/client";


export const INFO_QUERY = gql`
  query info($courseID: String!) {
    info(courseID: $courseID) {
      name
      attendants {
        name
        studentID
        isTeacher
      }
      courseID
    }
  }
`;

export const CHATBOX_OF_USER_QUERY = gql`
  query userChatbox($studentID: String!, $courseID: String!) {
    userChatbox(studentID: $studentID, courseID: $courseID) {
      name
      showName
      type
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
        linkType
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
      score
      weight
    }
  }
`;
export const HW_QUERY = gql`
  query hw($studentID: String!) {
    hw(studentID: $studentID) {
      title
      deadline
      description
      tFile {
        fileName
        fileLink
        linkType
      }
      sFile {
        studentID
        file {
          fileName
          fileLink
          linkType
        }
      }
    }
  }
`;
export const FILE_QUERY = gql`
  query {
    file {
      type
      info
      fileName
      fileLink
      linkType
    }
  }
`;

export const CHATBOX_QUERY = gql`
  query chatBox($name: String!, $courseID: String!, $studentID: String!) {
    chatbox(name: $name, courseID: $courseID, studentID: $studentID) {
      name
      messages {
        sender {
          name
          studentID
          groupNum
        }
        body
        hidden
      }
      type
      courseID
      notAccess
      pinMsg
      participants
    }
  }
`;

export const QUIZ_QUERY = gql`
  query quiz($name: String!, $courseID: String!, $studentID: String!) {
    quiz(name: $name, courseID: $courseID, studentID: $studentID) {
      chatbox
      groupShow
      progress
    }
  }
`;
