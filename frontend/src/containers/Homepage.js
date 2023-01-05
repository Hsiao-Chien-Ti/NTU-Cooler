import { Layout, Menu, theme } from "antd";
import React, { useEffect } from "react";
import { useState } from "react";
import { useAll } from "./hooks/useAll";
import HomepageContent from "../components/HomepageContent";
import { useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const Homepage = () => {
  const { syllabusLoading, syllabusData, logout, user } = useAll();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user.login) navigate("/");
  }, []);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Content
      style={{
        padding: 24,
        minHeight: 280,
        overflow: "auto",
      }}>
      {!syllabusLoading ? (
        <HomepageContent rawdata={syllabusData.syllabus}></HomepageContent>
      ) : (
        <p>loading</p>
      )}
    </Content>
  );
};
export default Homepage;
