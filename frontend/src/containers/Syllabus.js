import SyllabusContent from "../components/SyllabusContent";
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
const Syllabus = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { syllabusLoading, syllabusData, logout, user } = useAll();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user.login) navigate("/");
  }, []);
  return (
    <Content
      style={{
        padding: 24,
        minHeight: 280,
        background: colorBgContainer,
        overflow: "auto",
      }}>
      {/* {!syllabusLoading ? syllabusData.syllabus.map(({weekNum,outline,file}) =>(<SyllabusContent weekNum={weekNum} outline={outline}></SyllabusContent> )
                    ) : <p>loading</p>} */}
      {!syllabusLoading ? (
        <SyllabusContent rawdata={syllabusData.syllabus}></SyllabusContent>
      ) : (
        <p>loading</p>
      )}
    </Content>
  );
};
export default Syllabus;
