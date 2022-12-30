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
