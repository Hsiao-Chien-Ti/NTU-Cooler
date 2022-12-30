import SyllabusContent from "../components/SyllabusContent"
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    HomeOutlined,
    FileOutlined,
    ScheduleOutlined,
    NotificationOutlined,
    SolutionOutlined
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useAll } from './hooks/useAll';
const { Header, Sider, Content } = Layout;
const Syllabus = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const { syllabusLoading, syllabusData } = useAll()
    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['2']}
                >
                    <Menu.Item key="1">
                        <HomeOutlined />
                        <span>Homepage</span>
                        <Link to="/homepage" />
                    </Menu.Item>
                    <Menu.Item key="2">
                        <ScheduleOutlined />
                        <span>Syllabus</span>
                        <Link to="/syllabus" />
                    </Menu.Item>
                    <Menu.Item key="3">
                        <NotificationOutlined />
                        <span>Announcement</span>
                        <Link to="/announcement" />
                    </Menu.Item>
                    <Menu.Item key="4">
                        <SolutionOutlined />
                        <span>Grade</span>
                        <Link to="/grade" />
                    </Menu.Item>
                    <Menu.Item key="5">
                        <FileOutlined />
                        <span>Files</span>
                        <Link to="/files" />
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header style={{ padding: 5, background: colorBgContainer }}>
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
                    {!syllabusLoading ? syllabusData.syllabus.map(({weekNum,outline,file}) =>(<SyllabusContent weekNum={weekNum} outline={outline}></SyllabusContent> )
                    ) : <p>loading</p>}
                </Content>
            </Layout>
        </Layout>
    );
}
export default Syllabus