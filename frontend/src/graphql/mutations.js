import { gql } from '@apollo/client';

export const CREATE_USER_MUTATION =gql`
    mutation createUser($name: String!, $studentID: String!,$passwd:String!,$groupNum:Int) {
	createUser(name:$name,studentID:$studentID,passwd:$passwd,groupNum:$groupNum){
        name
        studentID
        groupNum
  }
}
`;
export const LOGIN_MUTATION =gql`
    mutation login($studentID: String!,$passwd:String!) {
	login(studentID:$studentID,passwd:$passwd)
}
`;
