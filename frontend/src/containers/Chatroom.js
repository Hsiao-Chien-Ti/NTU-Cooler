import styled from "styled-components";
import Message from "../components/Chatbox/Message";
import ChatModal from "../components/Chatbox/ChatboxModal";
import ChatboxHeader from "../components/Chatbox/ChatboxHeader";
import { useChat } from "./hooks/useChat";
import { Tabs } from "antd";
import { Input } from "antd";
import { useEffect, useState, useRef } from "react";
import { Layout, Menu, theme } from "antd";
import React from "react";
import { useAll } from "./hooks/useAll";
const { Content, Footer } = Layout;
const FootRef = styled.div`
  height: 20px;
`;

const ChatRoom = () => {
  const {
    messages,
    isQuiz,
    currentChat,
    chatBoxes,
    chatBoxLoading,
    pinMsg,
    access,
    queryChat,
    setPinMsg,
    setChatBoxes,
    startChat,
    sendMessage,
    queryChatBox,
    setCurrentChat,
    changePin,
    allBox,
    setAllBox,
  } = useChat();

  const { setStatus, attendants, user, courseID } = useAll();

  const [modalOpen, setModalOpen] = useState(false);
  const [msgSent, setMsgSent] = useState(false);
  const [body, setBody] = useState("");

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const msgFooter = useRef(null);
  const bodyRef = useRef(null);
  const pinRef = useRef(null);

  const scrollToBottom = () => {
    msgFooter.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    scrollToBottom();
    setMsgSent(false);
  }, [msgSent]);

  const handlePinOnClick = () => {
    if (pinMsg !== -1)
      pinRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const renderChat = () => {
    console.log("renderChat: ", currentChat);
    console.log(messages);
    console.log(messages.length);
    return messages.length === 0 ? (
      <p style={{ color: "#ccc" }}>No messages...</p>
    ) : (
      <>
        {messages.map((mes, i) => {
          return pinMsg === i ? (
            <div key={i}>
              <div ref={pinRef} />
              <Message
                isMe={mes.sender.studentID === user.studentID ? true : false}
                sender={mes.sender}
                message={mes.body}
                // key={i}
                access={access}
                hidden={mes.hidden}
                handleOnClickMessage={(e) => {
                  console.log("click", e);
                  if (e.key === "1") {
                    // pin message
                    changePin({
                      variables: {
                        name: currentChat,
                        courseID,
                        pinMsg: i,
                        studentID: user.studentID,
                      },
                    });
                  }
                }}
              />
            </div>
          ) : (
            <Message
              isMe={mes.sender.studentID === user.studentID ? true : false}
              sender={mes.sender}
              message={mes.body}
              key={i}
              access={access}
              hidden={mes.hidden}
              handleOnClickMessage={(e) => {
                console.log("click", e);
                if (e.key === "1") {
                  // pin message
                  changePin({
                    variables: {
                      name: currentChat,
                      courseID,
                      pinMsg: i,
                      studentID: user.studentID,
                    },
                  });
                  setPinMsg(i);
                }
              }}
            />
          );
        })}
        <FootRef ref={msgFooter} />
      </>
    );
  }; //produce chat's DOM nodes

  const createChatBox = async ({ name, participants, quiz }) => {
    let newName = name;
    if (participants.length === 2) {
      newName = participants.filter((p) => p !== user.studentID)[0];
    }
    if (allBox.some(({ key }) => key === name)) {
      setCurrentChat(name);
      setStatus({ type: "error", msg: newName + " has exist" });
      setModalOpen(false);
    } else {
      try {
        startChat({
          variables: {
            name,
            courseID,
            participants,
            type: quiz,
          },
        });
        console.log("Mutation_createChatBox:", name);

        setCurrentChat(name);
        let chat = [];
        if (name === currentChat) {
          chat = renderChat();
        }

        setAllBox([
          ...allBox,
          {
            label: newName,
            chat: chat,
            key: name,
            participants: participants,
          },
        ]);
        setMsgSent(true);
        setModalOpen(false);
        console.log("Start Chat with " + newName);
      } catch (e) {
        throw new Error("Mutation_createChatBox_error", e);
      }
    }
  };

  useEffect(() => {
    if (!isQuiz) {
      console.log("useEffect with messages/pinMsg");
      const chat = renderChat();
      let newChatBoxes = allBox;
      newChatBoxes.forEach((element, index) => {
        if (element.key === currentChat) {
          element.chat = chat;
        }
      });
      setChatBoxes(newChatBoxes);
      setAllBox(newChatBoxes);
      setMsgSent(true);
    }
  }, [messages, pinMsg, isQuiz]);

  const handleOnChange = (key) => {
    if (key) {
      setCurrentChat(key);
      console.log("HANDLEONCHANGE");
      let chat = [];
      if (key === currentChat) {
        chat = renderChat();
      }
      let newChatBoxes = allBox;
      newChatBoxes.forEach((element, index) => {
        if (element.key === key) {
          element.chat = chat;
        }
      });
      setChatBoxes(newChatBoxes);
      setAllBox(newChatBoxes);
    }
  };

  return (
    <Content
      style={{
        margin: "24px 16px",
        padding: 24,
        minHeight: 280,
        background: colorBgContainer,
      }}>
      <Layout style={{ flexDirection: "row" }}>
        <Menu
          onClick={(e) => {
            if (e.key === "_add_") {
              setModalOpen(true);
              console.log(user.isTeacher);
            } else handleOnChange(e.key);
          }}
          style={{ width: 128, justifyItems: "center" }}
          defaultSelectedKeys={[currentChat]}
          selectedKeys={[currentChat]}
          // defaultOpenKeys={[isQuiz? currentQuiz: currentChat]}
          mode="inline"
          items={[...allBox, { key: "_add_", label: "+" }]}
          theme="light"
        />
        {/* </Sider> */}
        {/* <Layout className="site-layout"> */}
        <Content style={{ margin: "16px 16px" }}>
          <div
            style={{
              maxHeight: "420px",
              flexDirection: "column",
            }}>
            {!chatBoxLoading ? (
              <div style={{ minHeight: "90%" }}>
                <ChatboxHeader
                  isPin={pinMsg !== -1}
                  msg={
                    pinMsg === -1 ? "no pinned message" : messages[pinMsg]?.body
                  }
                  groupName={allBox.find((b) => b.key === currentChat)?.label}
                  color={colorBgContainer}
                  handlePinOnClick={handlePinOnClick}
                />

                <div style={{ height: "16px" }}></div>
                <div
                  style={{
                    padding: 12,
                    overflow: "auto",
                    height: "300px",
                    background: colorBgContainer,
                  }}>
                  {allBox.find((b) => b.key === currentChat)
                    ? allBox.find((b) => b.key === currentChat).chat !== {}
                      ? allBox.find((b) => b.key === currentChat).chat
                      : "no messages"
                    : "no messages"}
                </div>

                <ChatModal
                  me={user.studentID}
                  open={modalOpen}
                  isTeacher={user.isTeacher}
                  onCreate={async ({ name, participants, quiz }) => {
                    await createChatBox({
                      name,
                      participants,
                      quiz,
                    });
                  }}
                  onCancel={() => {
                    setModalOpen(false);
                  }}
                  isQuiz={false}
                  users={attendants}
                />
                <Footer style={{ justifySelf: "flex-end", padding: 0 }}>
                  <Input.Search
                    ref={bodyRef}
                    enterButton="Send"
                    value={body}
                    placeholder="Type a message he re..."
                    onChange={(e) => {
                      setBody(e.target.value);
                    }}
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
                          senderID: user.studentID,
                          senderName: user.name,
                          to: currentChat,
                          body: msg,
                          courseID,
                        },
                      });
                      setBody("");
                      if (!access) {
                        console.log("finally", user.studentID, "can access!");
                      }
                    }}></Input.Search>
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
