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

const Quiz = () => {
  const { setStatus, attendants, allStudents, user, courseID } = useAll();
  const {
    messages,
    currentQuiz,
    chatBoxes,
    chatBoxLoading,
    pinMsg,
    access,
    queryChat,
    createQuiz,
    setPinMsg,
    setChatBoxes,
    startChat,
    sendMessage,
    queryChatBox,
    setCurrentQuiz,
    changePin,
  } = useChat();
  const [allBox, setAllBox] = useState([]);
  const [body, setBody] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [msgSent, setMsgSent] = useState(false);
  const msgFooter = useRef(null);
  const bodyRef = useRef(null);
  const pinRef = useRef(null);
  const scrollToBottom = () => {
    msgFooter.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  useEffect(() => {
    if (user.isTeacher) {
      setAllBox([
        ...chatBoxes.filter((c) => c.quiz === "true"),
        { key: "_add_", label: "+" },
      ]);
    } else {
      setAllBox([...chatBoxes.filter((c) => c.quiz === "true")]);
    }
  }, [chatBoxes]);
  useEffect(() => {
    scrollToBottom();
    setMsgSent(false);
  }, [msgSent]);
  useEffect(() => {
    const chat = renderChat();
    let newChatBoxes = chatBoxes;
    newChatBoxes.forEach((element, index) => {
      if (element.key === currentQuiz) {
        element.chat = chat;
      }
    });

    setChatBoxes(newChatBoxes);
    setMsgSent(true);
  }, [messages, pinMsg]);
  useEffect(() => {
    if (user.studentID) {
      console.log("QUERY in CHATBOX.js", user.studentID);
      queryChatBox({
        variables: {
          studentID: user.studentID,
          courseID,
        },
      });
    }
  }, [user.studentID, courseID]);
  useEffect(() => {
    const chat = renderChat();
    let newChatBoxes = chatBoxes;
    newChatBoxes.forEach((element, index) => {
      if (element.key === currentQuiz) {
        element.chat = chat;
      }
    });
    setChatBoxes(newChatBoxes);
  }, [pinMsg]);
  const handlePinOnClick = () => {
    if (pinMsg !== -1)
      pinRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const handleOnChange = (key) => {
    if (key) {
      setCurrentQuiz(key);
    }
  };
  const renderChat = () => {
    console.log("renderChat: ", currentQuiz);
    console.log(messages);
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
                        name: currentQuiz,
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
                      name: currentQuiz,
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

  const createChatBox = async ({
    name,
    groupShow,
    students,
    progress,
    teachers,
    question,
  }) => {
    if (chatBoxes.some(({ key }) => key === name)) {
      setStatus({ type: "error", msg: name + " has exist" });
    } else {
      try {
        createQuiz({
          variables: {
            progress,
            groupShow,
            courseID,
            students,
            teachers,
            name,
            question,
          },
        });
        console.log("Mutation_createQuiz:", name);
        setCurrentQuiz(name);
      } catch (e) {
        throw new Error("Mutation_createChatBox_error", e);
      }
      const chat = renderChat(name); //turn msgs into DOM nodes
      setChatBoxes([
        ...chatBoxes,
        {
          label: name,
          chat: chat,
          key: name,
          participants: [...students, ...teachers],
        },
      ]);
      setMsgSent(true);
      setModalOpen(false);
      console.log("QUIZ" + name);
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
          defaultSelectedKeys={[currentQuiz]}
          selectedKeys={[currentQuiz]}
          // defaultOpenKeys={[currentQuiz]}
          mode="inline"
          items={allBox}
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
                  groupName={currentQuiz}
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
                  {allBox.find((b) => b.key === currentQuiz)
                    ? allBox.find((b) => b.key === currentQuiz).chat !== {}
                      ? allBox.find((b) => b.key === currentQuiz).chat
                      : "no messages"
                    : "no messages"}
                </div>

                <ChatModal
                  me={user.studentID}
                  open={modalOpen}
                  isTeacher={user.isTeacher}
                  onCreate={async ({
                    name,
                    groupShow,
                    students,
                    progress,
                    teachers,
                    question,
                  }) => {
                    await createChatBox({
                      name,
                      groupShow,
                      students,
                      progress,
                      teachers,
                      question,
                    });
                  }}
                  onCancel={() => {
                    setModalOpen(false);
                  }}
                  users={attendants}
                  isQuiz={true}
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
                          to: currentQuiz,
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
export default Quiz;
