import { gql } from '@apollo/client';

export const SYLLABUS_SUBSCRIPTION = gql`
  subscription syllabus{
    syllabus {
      weekNum
      outline
      file{
        fileName
        fileLink
      }
  }
  }
`;
export const FILE_SUBSCRIPTION = gql`
  subscription file{
    file {
      type
      info
      fileName
      fileLink
  }
  }
`;
export const ANNOUNCEMENT_SUBSCRIPTION = gql`
  subscription announcement{
    announcement {
      time
      title
      content
  }
  }
`;