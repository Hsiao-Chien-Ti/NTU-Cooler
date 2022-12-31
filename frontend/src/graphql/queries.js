import { gql } from '@apollo/client';

export const SYLLABUS_QUERY = gql`
  query {
    syllabus{
      weekNum
      outline
      file{
        fileName
        fileLink
      }
    }
    }
`;
export const ANNOUNCEMENT_QUERY = gql`
    query {
      announcement{
        time
        title
        content
    }
    }
`;

export const GRADE_QUERY = gql`
  query grade($studentID: String!, $subject: String!){
    grade(studentID: $studentID, subject: $subject){
        studentID
        subject
        itemName
        type
        score
        weight
    }
  }
`;
export const FILE_QUERY = gql`
    query {
      file{
        type
        info
        fileName
        fileLink
    }
    }
`;