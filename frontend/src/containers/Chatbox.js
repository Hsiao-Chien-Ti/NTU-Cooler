import Message from "../components/Chatbox/Message";
import { Breadcrumb } from "antd";
import styled from "styled-components";
import { useChat } from "./hooks/useChat";
import { Input, Tabs } from "antd";
import ChatModal from "../components/Chatbox/ChatboxContent";
import { useEffect, useState, useRef } from "react";
import { Layout, Menu, theme } from "antd";
import React from "react";
import { useAll } from "./hooks/useAll";
import ChatboxHeader from "../components/Chatbox/ChatboxHeader";
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

const FootRef = styled.div`
  height: 20px;
`;
const ChatRoom = () => {
  const {
    currentChat,
    messages,
    chatBoxes,
    chatBoxLoading,
    pinMsg,
    setPinMsg,
    setCurrentChat,
    setMessages,
    setChatBoxes,
    startChat,
    sendMessage,
    queryChat,
  } = useChat();
  const { setStatus, attendants, user, courseID } = useAll();

  const [modalOpen, setModalOpen] = useState(false);
  const [msgSent, setMsgSent] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const msgFooter = useRef(null);
  const bodyRef = useRef(null);

  const scrollToBottom = () => {
    msgFooter.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  useEffect(() => {
    scrollToBottom();
    setMsgSent(false);
  }, [msgSent]);

  const renderChat = () => {
    console.log("renderChat");
    console.log(messages);
    return messages.length === 0 ? (
      <p style={{ color: "#ccc" }}>No messages...</p>
    ) : (
      <>
        {messages.map((mes, i) => (
          <Message
            isMe={mes.sender === user.name ? true : false}
            sender={mes.sender}
            message={mes.body}
            key={i}
          />
        ))}
        <FootRef ref={msgFooter} />
      </>
    );
  }; //produce chat's DOM nodes

  const testChat = async (name, participants) => {
    try {
      const box = await startChat({
        variables: {
          name,
          courseID,
          participants,
        },
      });
      return box;
    } catch (e) {
      throw new Error("Mutation_createChatBox_error", e);
    }
  };

  const createChatBox = async ({ name, participants }) => {
    let newName = name;
    if (participants.length === 2) {
      newName = participants[0];
    }
    if (chatBoxes.some(({ key }) => key === name)) {
      setCurrentChat(name);
      setModalOpen(false);
    } else {
      const CurrentChatBox = testChat({
        name,
        participants,
      });
      console.log("Mutation_createChatBox:", CurrentChatBox);
      setCurrentChat(name);
      const chat = renderChat(); //turn msgs into DOM nodes
      setChatBoxes([
        ...chatBoxes,
        {
          label: newName,
          chat: chat,
          key: CurrentChatBox.name,
          participants: CurrentChatBox.participants,
        },
      ]);
      setMsgSent(true);
      setModalOpen(false);
      console.log("Start Chat with " + newName);
    }
  };
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
  }, [messages]);

  const handleOnChange = (key) => {
    if (key) {
      // queryChat({
      //   variables: {
      //     name: key,
      //     courseID,
      //     studentID: user.studentID,
      //   },
      // });
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
    <Content
      style={{
        margin: "24px 16px",
        padding: 24,
        minHeight: 280,
        background: colorBgContainer,
      }}
    >
      <Layout style={{ flexDirection: "row" }}>
        <Menu
          onClick={(e) => {
            if (e.key === "_add_") {
              setModalOpen(true);
            } else handleOnChange(e.key);
          }}
          style={{ width: 128, justifyItems: "center" }}
          defaultSelectedKeys={[currentChat]}
          // defaultOpenKeys={[currentChat]}
          mode="inline"
          items={[...chatBoxes, { key: "_add_", label: "+" }]}
          theme="light"
        />
        {/* </Sider> */}
        {/* <Layout className="site-layout"> */}
        <Content style={{ margin: "16px 16px" }}>
          <div
            style={{
              maxHeight: "420px",
              flexDirection: "column",
            }}
          >
            {!chatBoxLoading ? (
              <div style={{ minHeight: "90%" }}>
                <ChatboxHeader
                  isPin={pinMsg !== -1}
                  msg={
                    pinMsg === -1 ? "no pinned message" : messages[pinMsg]?.body
                  }
                  groupName={
                    chatBoxes.find((b) => b.key === currentChat)?.label
                  }
                  color={colorBgContainer}
                />

                <div style={{ height: "16px" }}></div>
                <div
                  style={{
                    padding: 12,
                    overflow: "auto",
                    height: "300px",
                    background: colorBgContainer,
                  }}
                >
                  {chatBoxes.find((b) => b.key === currentChat)
                    ? chatBoxes.find((b) => b.key === currentChat).chat !== {}
                      ? chatBoxes.find((b) => b.key === currentChat).chat
                      : "no messages"
                    : "no messages"}
                </div>

                <ChatModal
                  me={user.studentID}
                  open={modalOpen}
                  onCreate={async ({ name, participants }) => {
                    await createChatBox({ name, participants });
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
                          sender: user.studentID,
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
        {/* </Layout> */}
      </Layout>
    </Content>
  );
};
export default ChatRoom;
