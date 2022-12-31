import { useState, useEffect } from "react";
import { createContext, useContext } from "react";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import {
  LOGIN_MUTATION,
  SYLLABUS_QUERY,
  ANNOUNCEMENT_QUERY,
  GRADE_QUERY,
} from "../../graphql";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
const LOCALSTORAGE_KEY = "k";
const savedMe = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY));

const AllContext = createContext({
  user: { login: false },
  signIn: [],
  status: {},
  displayStatus: () => {},
  loginData: {},
  syllabusData: [],
  syllabusLoading: false,
  announcementData: [],
  announcementLoading: false,
  gradeData: [],
  gradeLoading: false,
  getGrade: () => {},
  subject: "",
  logout: () => {},
});
const AllProvider = (props) => {
  const [user, setUser] = useState(savedMe || { login: false });
  const [subject, setSubject] = useState("Introduction to Computer Network");
  const [signIn, { data: loginData }] = useMutation(LOGIN_MUTATION);
  useEffect(() => {
    console.log(loginData);
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
    if (user.login) {
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(user));
      // console.log(JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)))
    }
  }, [user]);
  function logout(e) {
    if (e.key == 6) setUser({ login: false });
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
  const { data: syllabusData, loading: syllabusLoading } =
    useQuery(SYLLABUS_QUERY);
  const { data: announcementData, loading: announcementLoading } =
    useQuery(ANNOUNCEMENT_QUERY);
  const [getGrade, { data: gradeData, loading: gradeLoading }] = useLazyQuery(
    GRADE_QUERY,
    {
      variables: { studentID: user.studentID, subject: subject },
    }
  );
  return (
    <AllContext.Provider
      value={{
        subject,
        user,
        setUser,
        signIn,
        status,
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
      }}
      {...props}
    />
  );
};
const useAll = () => useContext(AllContext);
export { AllProvider, useAll };
