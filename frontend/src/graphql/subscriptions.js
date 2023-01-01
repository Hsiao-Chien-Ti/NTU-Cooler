import { gql } from "@apollo/client";

export const MESSAGE_SUBSCRIPTION = gql`
  subscription message($to: String!, $courseID: String!) {
    message(to: $to, courseID: $courseID) {
      sender
      body
    }
  }
`;
