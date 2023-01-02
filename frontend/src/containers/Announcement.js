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
import AnnouncementContent from "../components/AnnouncementContent";
import { useNavigate } from "react-router-dom";
const { Header, Sider, Content } = Layout;
const Announcement = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { announcementLoading, announcementData, logout, user } = useAll();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user.login) navigate("/");
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
      {!announcementLoading ? (
          <AnnouncementContent
            rawdata={announcementData.announcement}
          ></AnnouncementContent>
      ) : (
        <p>loading</p>
      )}
    </Content>
  );
};
export default Announcement;
