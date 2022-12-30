import { gql } from '@apollo/client';

export const SYLLABUS_SUBSCRIPTION = gql`
  subscription syllabus {
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
