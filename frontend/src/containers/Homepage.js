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
        margin: "24px 16px",
        padding: 24,
        minHeight: 280,
        background: colorBgContainer,
      }}
    >
      {!syllabusLoading ? (
        syllabusData.syllabus.map(({ weekNum, outline, file, index }) => (
          <HomepageContent
            weekNum={weekNum}
            outline={outline}
            file={file}
            key={index}
          ></HomepageContent>
        ))
      ) : (
        <p>loading</p>
      )}
    </Content>
  );
};
export default Homepage;
