import { useState, useEffect } from "react";
import { createContext, useContext } from "react";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import {
  LOGIN_MUTATION,
  SYLLABUS_QUERY,
  ANNOUNCEMENT_QUERY,
  GRADE_QUERY,
  FILE_QUERY,
  CREATE_ANNOUNCEMENT_MUTATION,
  CREATE_SYLLABUS_MUTATION,
  CREATE_FILE_MUTATION,
  SYLLABUS_SUBSCRIPTION,
  FILE_SUBSCRIPTION,
  ANNOUNCEMENT_SUBSCRIPTION,
  CREATE_GRADE_MUTATION,
  GRADE_SUBSCRIPTION,
  INFO_QUERY,
} from "../../graphql";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
const LOCALSTORAGE_KEY = "save-me";
const savedMe = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY));

const AllContext = createContext({
  user: { name: "", passwd: "", studentID: "", login: false },
  attendants: [],
  courseID: "",
  signIn: [],
  status: {},
  setStatus: () => { },
  displayStatus: () => { },
  loginData: {},
  syllabusData: [],
  syllabusLoading: false,
  announcementData: [],
  announcementLoading: false,
  gradeData: [],
  gradeLoading: false,
  getGrade: () => { },
  subject: "",
  logout: () => { },
  fileData: [],
  fileLoading: false,
  createAnnouncement: [],
  createSyllabus: [],
  createFile: [],
  createGrade: [],
});
const AllProvider = (props) => {
  const [user, setUser] = useState(savedMe || { login: false });
  const [subject, setSubject] = useState("Introduction to Computer Network");
  const [courseID, setCourseID] = useState("EE1234");
  const [attendants, setAttendants] = useState([]);
  const [signIn, { data: loginData }] = useMutation(LOGIN_MUTATION);
  const { data: courseInfo, loading: infoLoading } = useQuery(INFO_QUERY, {
    variables: {
      courseID,
    },
  });
  useEffect(() => {
    if (!infoLoading) {
      const users = courseInfo.info.attendants
        .filter((person) => person.studentID !== user.studentID)
        .map((person) => {
          return {
            value: person.studentID,
            label: person.name + " (" + person.studentID + ") ",
          };
        });
      console.log(users);
      setAttendants(users);
      // console.log(courseInfo);
    }
  }, [courseInfo, user]);
  useEffect(() => {
    if (loginData != undefined) {
      setUser(loginData.login);
      if (!loginData.login.login) {
        displayStatus({
          type: "error",
          msg: "Invalid student ID or password",
          duration: 1,
        });
      } else {
      }
    }
  }, [loginData]);
  useEffect(() => {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(user));
  }, [user]);
  function logout(e) {
    if (e.key == "_logout_") setUser({ login: false });
  }
  const [status, setStatus] = useState({});
  const displayStatus = (s) => {
    if (s.msg) {
      const { type, msg, duration } = s;
      const content = {
        content: msg,
        duration: duration,
      };
      switch (type) {
        case "success":
          message.success(content);
          break;
        case "error":
        default:
          message.error(content);
          break;
      }
    }
  };
  useEffect(() => {
    displayStatus(status);
  }, [status]);
  const {
    data: syllabusData,
    loading: syllabusLoading,
    subscribeToMore: syllabusSubscribe,
  } = useQuery(SYLLABUS_QUERY);
  useEffect(() => {
    try {
      syllabusSubscribe({
        document: SYLLABUS_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
          console.log(subscriptionData);
          if (!subscriptionData.data) return prev;
          const newSyllabus = subscriptionData.data.syllabus;
          return {
            ...prev,
            syllabus: [
              newSyllabus,
              ...prev.syllabus.filter((f) => f.weekNum != newSyllabus.weekNum),
            ],
          };
        },
      });
    } catch (e) { }
  }, [syllabusSubscribe]);
  const {
    data: announcementData,
    loading: announcementLoading,
    subscribeToMore: announcementSubscribe,
  } = useQuery(ANNOUNCEMENT_QUERY);
  useEffect(() => {
    try {
      announcementSubscribe({
        document: ANNOUNCEMENT_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const newAnnouncement = subscriptionData.data.announcement;
          return {
            ...prev,
            announcement: [
              newAnnouncement,
              ...prev.announcement.filter(
                (f) => f.title != newAnnouncement.title
              ),
            ],
          };
        },
      });
    } catch (e) { }
  }, [announcementSubscribe]);
  const {
    data: fileData,
    loading: fileLoading,
    subscribeToMore: fileSubscribe,
  } = useQuery(FILE_QUERY);
  useEffect(() => {
    try {
      fileSubscribe({
        document: FILE_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
          console.log(subscriptionData);
          if (!subscriptionData.data) return prev;
          const newFile = subscriptionData.data.file;
          return {
            ...prev,
            file: [
              newFile,
              ...prev.file.filter(
                (f) =>
                  !(
                    f.type === newFile.type &&
                    f.info === newFile.info &&
                    f.fileName === newFile.fileName
                  )
              ),
            ],
          };
        },
      });
    } catch (e) { }
  }, [fileSubscribe]);
  const [
    getGrade,
    { data: gradeData, loading: gradeLoading, subscribeToMore: gradeSubscribe },
  ] = useLazyQuery(GRADE_QUERY, {
    variables: { studentID: user.studentID, subject: subject },
    fetchPolicy: "network-only",
  });
  useEffect(() => {
    if (user.login) {
      try {
        gradeSubscribe({
          document: GRADE_SUBSCRIPTION,
          variables: { studentID: user.studentID, subject: subject },
          updateQuery: (prev, { subscriptionData }) => {
            console.log(prev);
            if (!subscriptionData.data) return prev;
            const newGrade = subscriptionData.data.grade;
            return {
              ...prev,
              grade: [
                newGrade,
                ...prev.grade.filter((f) => f.itemName !== newGrade.itemName),
              ],
            };
          },
        });
      } catch (e) { }
    }
  }, [gradeSubscribe, user]);
  const [createAnnouncement] = useMutation(CREATE_ANNOUNCEMENT_MUTATION);
  const [createSyllabus] = useMutation(CREATE_SYLLABUS_MUTATION);
  const [createFile] = useMutation(CREATE_FILE_MUTATION);
  const [createGrade] = useMutation(CREATE_GRADE_MUTATION);

  useEffect(() => {
    if (user.login) {
      document.addEventListener("mousemove", () => {
        localStorage.setItem('lastActvity', new Date())
      });
      document.addEventListener("click", () => {
        localStorage.setItem('lastActvity', new Date())
      });
      let timeInterval = setInterval(() => {
        let lastAcivity = localStorage.getItem('lastActvity')
        var diffMs = Math.abs(new Date(lastAcivity) - new Date()); // milliseconds between now & last activity
        var seconds = Math.floor((diffMs / 1000));
        var minute = Math.floor((seconds / 60));
        // console.log(seconds +' sec and '+minute+' min since last activity')
        if (minute == 1) {
          console.log('No activity from last 10 minutes... Logging Out')
          clearInterval(timeInterval)
          setUser({ login: false });
        }
      }, 1000)
    }

  }, [user])

  return (
    <AllContext.Provider
      value={{
        subject,
        user,
        attendants,
        courseID,
        setUser,
        signIn,
        status,
        setStatus,
        displayStatus,
        loginData,
        syllabusData,
        syllabusLoading,
        announcementData,
        announcementLoading,
        gradeData,
        gradeLoading,
        getGrade,
        logout,
        fileData,
        fileLoading,
        createAnnouncement,
        createSyllabus,
        createFile,
        createGrade,
      }}
      {...props}
    />
  );
};
const useAll = () => useContext(AllContext);
export { AllProvider, useAll };
