import GradeContent from "../components/GradeContent";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  FileOutlined,
  ScheduleOutlined,
  NotificationOutlined,
  SolutionOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import React, { useEffect } from "react";
import { useState } from "react";
import { useAll } from "./hooks/useAll";
import { useNavigate } from "react-router-dom";
const { Header, Sider, Content } = Layout;
const Grade = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { gradeLoading, gradeData, getGrade, subject, user, logout } = useAll();
  const navigate = useNavigate();  
  useEffect(() => {
    if (!user.login) {
      console.log(user)
      navigate("/");
      return;
    }
    
    getGrade({ variables: { studentID: user.studentID, subject: subject } });
  }, []);

  return (
    <Content
      style={{
        margin: "24px 16px",
        padding: 24,
        minHeight: 280,
        background: colorBgContainer,
      }}
    >
      {!gradeLoading ? (
        <GradeContent rawdata={gradeData}></GradeContent>
      ) : (
        <p>loading</p>
      )}
    </Content>
  );
};
export default Grade;
