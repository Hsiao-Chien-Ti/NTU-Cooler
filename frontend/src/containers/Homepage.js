import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme} from 'antd';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import React from 'react';
import { useState } from 'react';

const { Header, Sider, Content } = Layout;
const Homepage = () => {
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
                    defaultSelectedKeys={['1']}
                >
                    <Menu.Item key="1">
                        <UserOutlined />
                        <span>Syllabus</span>
                        <Link to="/syllabus" />
                    </Menu.Item>
                    <Menu.Item key="2">
                        <UserOutlined />
                        <span>Announcement</span>
                        <Link to="/announcement" />
                    </Menu.Item>
                    <Menu.Item key="3">
                        <UserOutlined />
                        <span>Grade</span>
                        <Link to="/grade" />
                    </Menu.Item>
                    <Menu.Item key="4">
                        <UserOutlined />
                        <span>Files</span>
                        <Link to="/files" />
                    </Menu.Item>
                </Menu>
                {/* items={[
                    {
                        key: '1',
                        icon: <UserOutlined />,
                        label: 'nav 1',

                    },
                    {
                        key: '2',
                        icon: <VideoCameraOutlined />,
                        label: 'nav 2',
                    },
                    {
                        key: '3',
                        icon: <UploadOutlined />,
                        label: 'nav 3',
                    },
                ]}
            /> */}
            </Sider>
            <Layout className="site-layout">
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: () => setCollapsed(!collapsed),
                    })}
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                    }}
                >
                    Content
                </Content>
            </Layout>
        </Layout>
    );
}
export default Homepage