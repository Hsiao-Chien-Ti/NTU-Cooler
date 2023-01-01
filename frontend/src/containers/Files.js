import FileContent from "../components/FileContent";
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
const Files = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { fileLoading, fileData, subject, user, logout } = useAll();
  useEffect(() => {
    if (!user.login) {
      navigate("/");
      return;
    }
  }, []);
  const navigate = useNavigate();
  return (
    <Content
      style={{
        margin: "24px 16px",
        padding: 24,
        minHeight: 280,
        background: colorBgContainer,
      }}
    >
      {!fileLoading ? (
        <FileContent rawdata={fileData.file}></FileContent>
      ) : (
        <p>loading</p>
      )}
    </Content>
  );
};
export default Files;
