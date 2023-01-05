import { Layout, Menu, theme } from "antd";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import React, { useEffect } from "react";
import { useState } from "react";
import { useAll } from "./hooks/useAll";
import AnnouncementContent from "../components/AnnouncementContent";
import { useNavigate } from "react-router-dom";
const { Header, Sider, Content } = Layout;
const Announcement = () => {
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
        padding: 24,
        minHeight: 280,
        overflow: "auto",
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
