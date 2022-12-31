import { gql } from '@apollo/client';

export const CREATE_USER_MUTATION = gql`
    mutation createUser($name: String!, $studentID: String!,$passwd:String!,$groupNum:Int) {
	createUser(name:$name,studentID:$studentID,passwd:$passwd,groupNum:$groupNum){
        name
        studentID
        groupNum
  }
}
`;
export const LOGIN_MUTATION = gql`
    mutation login($studentID: String!,$passwd:String!) {
	login(studentID:$studentID,passwd:$passwd){
        name
        studentID
        groupNum
        login
    }
}
`;
export const CREATE_SYLLABUS_MUTATION = gql`
    mutation createSyllabus($weekNum: String!, $outline: String,$fileName:String,$fileLink:String) {
    createSyllabus(weekNum: $weekNum, outline: $outline,fileName:$fileName,fileLink:$fileLink) {
        weekNum
        outline
        file{
            fileName
            fileLink
        } 
  }
}
`;
export const CREATE_FILE_MUTATION = gql`
    mutation createFile($type: String!, $info: String!,$fileName:String!,$fileLink:String!) {
    createFile(type: $type, outline: $outline,fileName:$fileName,fileLink:$fileLink) {
        type
        info
        fileName
        fileLink
  }
}
`;
export const CREATE_ANNOUNCEMENT_MUTATION = gql`
    mutation createAnnouncement($time: String!, $title: String!,$content:String) {
    createSyllabus(time:$time,title:$title,content:$content) {
        time
        title
        content
  }
}
`;