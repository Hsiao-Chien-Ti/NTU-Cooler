import Message from "../components/Chatbox/Message";
import { Breadcrumb } from "antd";
import styled from "styled-components";
import { useChat } from "./hooks/useChat";
import { Input, Tabs } from "antd";
import ChatModal from "../components/Chatbox/ChatboxModal";
import { useEffect, useState, useRef } from "react";
import { Layout, Menu, theme } from "antd";
import React from "react";
import { useAll } from "./hooks/useAll";
import ChatboxHeader from "../components/Chatbox/ChatboxHeader";
import { selectHttpOptionsAndBody } from "@apollo/client";
import ChatBox from "../components/Chatbox/ChatBox";
const { Content, Footer } = Layout;

const ChatBoxesWrapper = styled(Tabs)`
  width: 100%;
  height: 300px;
  background: #eeeeee52;
  border-radius: 10px;
  margin: 20px;
  padding: 20px;
  overflow: auto;
`;

const ChatRoom = () => {
  const [allChatBoxes, setAllChatBoxes] = useState([]);
  const { chatBoxes, setCurrentChat, currentChat, queryChatBox } = useChat();
  const { courseID, user } = useAll();
  useEffect(() => {
    console.log("ALL CHATBOXES:", allChatBoxes);
  }, [allChatBoxes]);
  useEffect(() => {
    // setAllChatBoxes([
    //   ...chatBoxes.filter((c) => c.quiz === "true"),
    //   { key: "_add_", label: "+" },
    // ]);
    queryChatBox({
      variables: {
        studentID: user.studentID,
        courseID,
      },
    });
    setAllChatBoxes(chatBoxes);
  }, [chatBoxes]);
  return (
    <Content
      style={{
        margin: "24px 16px",
        padding: 24,
        minHeight: 280,
        background: colorBgContainer,
      }}>
      <ChatBox
        isQuiz={false}
        allBox={allChatBoxes}
        handleSetCurrent={setCurrentChat}
        current={currentChat}
      />
    </Content>
  );
};
export default ChatRoom;
