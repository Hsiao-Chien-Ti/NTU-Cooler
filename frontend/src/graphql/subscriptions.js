import { gql } from "@apollo/client";

export const MESSAGE_SUBSCRIPTION = gql`
  subscription message($from: String!, $to: String!, $courseID: String!) {
    message(from: $from, to: $to, courseID: $courseID) {
      sender
      body
    }
  }
`;
