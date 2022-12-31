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