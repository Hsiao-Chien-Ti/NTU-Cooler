import Message from "../components/Chatbox/Message";
import { Breadcrumb } from "antd";
import styled from "styled-components";
import { useChat } from "./hooks/useChat";
import { Input, Tabs } from "antd";
import ChatModal from "../components/Chatbox/ChatboxContent";
import { useEffect, useState, useRef } from "react";
import { subscribe } from "graphql";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  FileOutlined,
  ScheduleOutlined,
  NotificationOutlined,
  SolutionOutlined,
  WechatOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import React from "react";
import { useAll } from "./hooks/useAll";
import HomepageContent from "../components/HomepageContent";
const { Header, Sider, Content, Footer } = Layout;

const ChatBoxesWrapper = styled(Tabs)`
  width: 100%;
  height: 300px;
  background: #eeeeee52;
  border-radius: 10px;
  margin: 20px;
  padding: 20px;
  overflow: auto;
`;

const FootRef = styled.div`
  height: 20px;
`;
const ChatRoom = () => {
  const {
    messages,
    chatBoxData,
    chatBoxLoading,
    listLoading,
    listOfChatboxes,
    currentChat,
    setMe,
    me,
    setCurrentChat,
    sendMessage,
    startChat,
    setStatus,
  } = useChat();
  const { logout, attendants, user, courseID } = useAll();

  const [modalOpen, setModalOpen] = useState(false);
  const [msgSent, setMsgSent] = useState(false);
  const [chatBoxes, setChatBoxes] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const msgFooter = useRef(null);
  const bodyRef = useRef(null);

  const scrollToBottom = () => {
    msgFooter.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  useEffect(() => {
    if (!listLoading) {
      let newChatBoxes = [];
      console.log(listOfChatboxes);
      listOfChatboxes.userChatbox.forEach((room) => {
        newChatBoxes.push({
          key: room.name,
          label: room.showName,
          chat: {},
        });
        console.log(newChatBoxes);
      });
      setChatBoxes(newChatBoxes);
    }
  }, [listOfChatboxes]);
  useEffect(() => {
    scrollToBottom();
    // renderChat();
    setMsgSent(false);
  }, [msgSent]);

  useEffect(() => {
    const chat = renderChat();
    let newChatBoxes = chatBoxes;
    newChatBoxes.forEach((element, index) => {
      if (element.key === currentChat) {
        element.chat = chat;
      }
    });
    setChatBoxes(newChatBoxes);
    setMsgSent(true);
  }, [messages, currentChat]);
  //const renderChat = (chat) => <div>test</div>;
  const renderChat = () => {
    console.log("re-render");
    console.log(messages);
    return messages.length === 0 ? (
      <p style={{ color: "#ccc" }}>No messages...</p>
    ) : (
      <>
        {messages.map((mes, i) => (
          <Message
            isMe={mes.sender === user.name ? true : false}
            message={mes.body}
            key={i}
          />
        ))}
        <FootRef ref={msgFooter} />
      </>
    );
  }; //produce chat's DOM nodes

  const createChatBox = (room) => {
    if (chatBoxes.some(({ key }) => key === room)) {
      setStatus({
        type: "error",
        msg: room + "'s chat box has already opened.",
      });
      throw new Error(room + "'s chat box has already opened.");
    }
    const chat = renderChat(); //turn msgs into DOM nodes

    setChatBoxes([
      ...chatBoxes,
      {
        label: room.showName,
        chat: chat,
        key: room.name,
        participants: room.participants,
      },
    ]);
    setMsgSent(true);
  };
  const removeChatBox = (targetKey, activeKey) => {
    const index = chatBoxes.findIndex(({ key }) => key === activeKey);
    const newChatBoxes = chatBoxes.filter(({ key }) => key !== targetKey);
    setChatBoxes(newChatBoxes);
    return activeKey
      ? activeKey === targetKey
        ? index === 0
          ? ""
          : chatBoxes[index - 1].key
        : activeKey
      : "";
  };
  const testChat = (name, participants) => {
    try {
      const box = startChat({
        variables: {
          name,
          courseID,
          participants,
        },
      });
      return box;
    } catch (e) {
      throw new Error(e);
    }
  };
  const handleOnChange = (key) => {
    if (key) {
      setCurrentChat(key);
      const chat = renderChat();
      let newChatBoxes = chatBoxes;
      newChatBoxes.forEach((element, index) => {
        if (element.key === key) {
          element.chat = chat;
        }
      });
      setChatBoxes(newChatBoxes);
    }
  };

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["6"]}
          onClick={logout}
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
          <Menu.Item key="6">
            <WechatOutlined />
            <span>Discussions</span>
            <Link to="/chatroom" />
          </Menu.Item>
          <Menu.Item key="7">
            <LogoutOutlined />
            <span>Logout</span>
            <Link to="/" />
          </Menu.Item>
        </Menu>
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
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Layout style={{ flexDirection: "row" }}>
            {/* <Sider
              style={{ width: 128 }}
              // collapsible
              // collapsed={collapsed}
              // onCollapse={(value) => setCollapsed(value)}
            > */}
            {/* <div
                style={{
                  height: 32,
                  margin: 16,
                  background: "rgba(255, 255, 255, 0.2)",
                }}
              /> */}
            <Menu
              onClick={(e) => {
                if (e.key === "_add_") {
                  setModalOpen(true);
                  setMe(!me);
                } else handleOnChange(e.key);
              }}
              style={{ width: 128 }}
              defaultSelectedKeys={[currentChat]}
              // defaultOpenKeys={[currentChat]}
              mode="inline"
              items={[...chatBoxes, { key: "_add_", label: "+" }]}
              theme="light"
            />
            {/* </Sider> */}
            <Layout className="site-layout">
              <Content style={{ margin: "0 16px" }}>
                <Breadcrumb style={{ margin: "16px 0" }}>
                  <Breadcrumb.Item>
                    {chatBoxes.find((b) => b.key === currentChat)
                      ? chatBoxes.find((b) => b.key === currentChat).label
                      : "Choose One To Start"}
                  </Breadcrumb.Item>
                </Breadcrumb>
                <div
                  style={{
                    padding: 24,
                    minHeight: 360,
                    background: colorBgContainer,
                    flexDirection: "column",
                  }}
                >
                  {!chatBoxLoading ? (
                    <div style={{ minHeight: "90%" }}>
                      <div style={{ height: "320px" }}>
                        {chatBoxes.find((b) => b.key === currentChat)
                          ? chatBoxes.find((b) => b.key === currentChat).chat
                            ? chatBoxes.find((b) => b.key === currentChat).chat
                            : "no messages"
                          : "no messages"}
                      </div>

                      <ChatModal
                        me={user.studentID}
                        open={modalOpen}
                        onCreate={async ({ name, participants }) => {
                          console.log(name);
                          setCurrentChat(name);
                          const CurrentChatBox = testChat({
                            name,
                            participants,
                          });
                          console.log(chatBoxData);
                          console.log(CurrentChatBox);
                          let newName = name;
                          if (participants.length === 2) {
                            newName = participants[0];
                          }
                          createChatBox(CurrentChatBox);
                          setModalOpen(false);
                          console.log("Start Chat with " + newName);
                        }}
                        onCancel={() => {
                          setModalOpen(false);
                        }}
                        users={attendants}
                      />
                      <Footer style={{ justifySelf: "flex-end", padding: 0 }}>
                        <Input.Search
                          ref={bodyRef}
                          enterButton="Send"
                          placeholder="Type a message here..."
                          onSearch={(msg) => {
                            if (!msg) {
                              setStatus({
                                type: "error",
                                msg: "Please enter a message body.",
                              });
                              return;
                            }
                            sendMessage({
                              variables: {
                                name: user.studentID,
                                to: currentChat,
                                body: msg,
                                courseID,
                              },
                            });
                            //setBody("");
                          }}
                        ></Input.Search>
                      </Footer>
                    </div>
                  ) : (
                    <p>loading</p>
                  )}
                </div>
              </Content>
            </Layout>
          </Layout>
        </Content>
      </Layout>
    </Layout>
  );
};
export default ChatRoom;
