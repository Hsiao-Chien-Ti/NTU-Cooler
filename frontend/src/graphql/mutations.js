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
        isTeacher
    }
}
`;
export const CREATE_SYLLABUS_MUTATION = gql`
    mutation createSyllabus($weekNum: String!, $outline: String) {
    createSyllabus(weekNum: $weekNum, outline: $outline) {
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
    createFile(type: $type, info: $info,fileName:$fileName,fileLink:$fileLink) {
        type
        info
        fileName
        fileLink
  }
}
`;
export const CREATE_ANNOUNCEMENT_MUTATION = gql`
    mutation createAnnouncement($time: String!, $title: String!,$content:String) {
    createAnnouncement(time:$time,title:$title,content:$content) {
        time
        title
        content
  }
}
`;
export const CREATE_GRADE_MUTATION = gql`
mutation createGrade($studentID:String!,$subject:String!,$itemName:String!,$type:Boolean!,$score:Float!,$weight:Float) {
        studentID
        subject
        itemName
        type
        score
        weight
  }
`;