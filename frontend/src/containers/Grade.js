import GradeContent from "../components/GradeContent";
import { Layout, Menu, theme } from "antd";
import React, { useEffect } from "react";
import { useAll } from "./hooks/useAll";
const { Header, Sider, Content } = Layout;
const Grade = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { gradeLoading, gradeData } = useAll();

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
