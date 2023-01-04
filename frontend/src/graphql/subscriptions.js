import { gql } from "@apollo/client";

export const SYLLABUS_SUBSCRIPTION = gql`
  subscription syllabus {
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
export const FILE_SUBSCRIPTION = gql`
  subscription file {
    file {
      type
      info
      fileName
      fileLink
      linkType
  }
  }
`;
export const ANNOUNCEMENT_SUBSCRIPTION = gql`
  subscription announcement {
    announcement {
      time
      title
      content
    }
  }
`;
export const HW_SUBSCRIPTION = gql`
  subscription hw($studentID: String!) {
    hw(studentID: $studentID) {
      title
      deadline
      description
      tFile {
        fileName
        fileLink
        linkType
      }
      sFile{
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
export const GRADE_SUBSCRIPTION = gql`
  subscription grade($studentID: String!, $subject: String!) {
    grade(studentID: $studentID, subject: $subject) {
      studentID
      subject
      itemName
      score
      weight
    }
  }
`;

export const MESSAGE_SUBSCRIPTION = gql`
  subscription message($to: String!, $courseID: String!) {
    message(to: $to, courseID: $courseID) {
      sender {
        name
        studentID
      }
      body
      hidden
      groupNum
    }
  }
`;
 export const CHATBOXLIST_SUBSCRIPTION = gql`
   subscription chatbox($courseID: String!) {
     chatbox(courseID: $courseID) {
       name
     }
   }
 `;