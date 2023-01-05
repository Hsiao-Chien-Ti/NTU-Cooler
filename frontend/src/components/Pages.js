import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  FileOutlined,
  ScheduleOutlined,
  NotificationOutlined,
  CommentOutlined,
  SolutionOutlined,
  LogoutOutlined,
  FileTextOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, FloatButton } from "antd";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  Outlet,
} from "react-router-dom";
import React, { useEffect } from "react";
import { useState } from "react";
import { useAll } from "../containers/hooks/useAll";
import { useNavigate } from "react-router-dom";
import TeacherButton from "../containers/TeacherButton";
import Sider from "antd/es/layout/Sider";
import { Header } from "antd/es/layout/layout";
import { useChat } from "../containers/hooks/useChat";
import logo from "./logo.png";
import "./Pages.css";
const AllPages = [
  {
    key: "1",
    icon: <HomeOutlined />,
    name: "課程首頁",
    nav: "/course/homepage",
  },
  {
    key: "2",
    icon: <ScheduleOutlined />,
    name: "課堂大綱",
    nav: "/course/syllabus",
  },
  {
    key: "3",
    icon: <NotificationOutlined />,
    name: "課程公告",
    nav: "/course/announcement",
  },
  {
    key: "4",
    icon: <FileTextOutlined />,
    name: "回家作業",
    nav: "/course/hw",
  },
  {
    key: "5",
    icon: <SolutionOutlined />,
    name: "學習成績",
    nav: "/course/grade",
  },
  { key: "6", icon: <FileOutlined />, name: "資料文件", nav: "/course/files" },
  {
    key: "7",
    icon: <FormOutlined />,
    name: "隨堂小考",
    nav: "/course/quizzes",
  },
  {
    key: "8",
    icon: <CommentOutlined />,
    name: "傳送訊息",
    nav: "/course/messages",
  },

  { key: "_logout_", icon: <LogoutOutlined />, name: "登出帳號", nav: "/" },
];

const Page = ({ current, content }) => {
  const { logout, user } = useAll();
  const { setIsQuiz } = useChat();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user.login) navigate("/");
  }, [user.login]);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout className="Page">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          opacity: 1,
          flexdirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
        }}
        className="sider">
        <div style={{ height: "2em" }}></div>
        <div
          style={{
            fontFamily: "Arial",
            fontWeight: "bold",
            color: "#a2afc9",
            height: "3.5em",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyItems: "center",
          }}>
          <img src={logo} style={{ height: "4em" }} alt="WEB"></img>
        </div>
        <div
          style={{
            marginTop: "2em",
            width: "3.5em",
            height: "3em",
            display: "flex",
            justifyItems: "center",
            flexDirection: "column",
            alignItems: "center",
          }}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
              style: {
                color: "#a2afc9",
                fontSize: "1.5em",
                alignSelf: "flex-end",
              },
            }
          )}
        </div>

        <Menu
          className="menu"
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[current]}
          onClick={logout}>
          {AllPages.map((page) => (
            <Menu.Item
              className="menuItem"
              key={page.key}
              onClick={(e) => {
                if (e.key === "7") {
                  setIsQuiz(true);
                } else if (e.key === "8") {
                  setIsQuiz(false);
                }
              }}
              style={{
                height: "3em",
                fontSize: "large",
                alignItems: "flex-end",
                justifyItems: "flex-end",
              }}>
              {page.icon}
              <span>{page.name}</span>
              <Link to={page.nav} />
            </Menu.Item>
          ))}
        </Menu>
        {user.isTeacher && <TeacherButton />}
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{
            backgroundColor: "rgb(112, 163, 202)",
            height: "10em",
          }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignSelf: "center",
              justifyItem: "center",
              overflow: "hidden",
            }}>
            <h1 className="title">Introduction to Computer Networks</h1>
          </div>
        </Header>
        <Outlet />
      </Layout>
    </Layout>
  );
};

export default Page;
