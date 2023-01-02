import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  FileOutlined,
  ScheduleOutlined,
  NotificationOutlined,
  WechatOutlined,
  SolutionOutlined,
  LogoutOutlined,
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
const AllPages = [
  {
    key: "1",
    icon: <HomeOutlined />,
    name: "Homepage",
    nav: "/course/homepage",
  },
  {
    key: "2",
    icon: <ScheduleOutlined />,
    name: "Syllabus",
    nav: "/course/syllabus",
  },
  {
    key: "3",
    icon: <NotificationOutlined />,
    name: "Announcement",
    nav: "/course/announcement",
  },
  { key: "4", icon: <SolutionOutlined />, name: "Grade", nav: "/course/grade" },
  { key: "5", icon: <FileOutlined />, name: "Files", nav: "/course/files" },
  {
    key: "6",
    icon: <WechatOutlined />,
    name: "Messages",
    nav: "/course/messages",
  },
  { key: "_logout_", icon: <LogoutOutlined />, name: "Logout", nav: "/" },
];

const Page = ({ current, content }) => {
  const { logout, user } = useAll();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.login) navigate("/");
  }, [user.login]);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[current]}
          onClick={logout}
        >
          {AllPages.map((page) => (
            <Menu.Item key={page.key}>
              {page.icon}
              <span>{page.name}</span>
              <Link to={page.nav} />
            </Menu.Item>
          ))}
        </Menu>
        {user.isTeacher && <TeacherButton />}
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: 5, background: colorBgContainer }}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}
        </Header>
        <Outlet />
      </Layout>
    </Layout>
  );
};

export default Page;
