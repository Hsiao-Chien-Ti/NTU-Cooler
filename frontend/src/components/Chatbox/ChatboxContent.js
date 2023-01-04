import { useAll } from "../../containers/hooks/useAll";
import { useChat } from "../../containers/hooks/useChat";
import { useState, useRef, useEffect } from "react";
import { Layout, Menu, theme, Input } from "antd";
import React from "react";
import { useQuiz } from "../../containers/hooks/useQuiz";
import styled from "styled-components";
import Message from "./Message";
import ChatModal from "./ChatboxModal";
import ChatboxHeader from "./ChatboxHeader";
const { Content, Footer } = Layout;
const FootRef = styled.div`
  height: 20px;
`;
const Chatbox = (isQuiz) => {
  const {
    chatBoxLoading,
    pinMsg,
    messages,
    chatBoxes,
    queryChatBox,
    sendMessage,
    access,
    currentQuiz,
    currentChat,
    setPinMsg,
    setChatBoxes,
    changePin,
    setCurrentChat,
    setCurrentQuiz,
  } = useChat();

  const { user, attendants, courseID, setStatus } = useAll();

  const [modalOpen, setModalOpen] = useState(false);
  const [msgSent, setMsgSent] = useState(false);
  const [body, setBody] = useState("");
  const { allQuiz, createChatBox: createQuizBox, setAllQuiz } = useQuiz();

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
    console.log("renderChat: ");
    const current = isQuiz ? currentQuiz : currentChat;
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
                        name: current,
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
                      name: current,
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
      </>
    );
  }; //produce chat's DOM nodes

  const createChatBox = ({
    progress,
    groupShow,
    courseID,
    students,
    teachers,
    name,
    question,
  }) => {
    createQuizBox({
      progress,
      groupShow,
      courseID,
      students,
      teachers,
      name,
      question,
    });
    const chat = renderChat(); //turn msgs into DOM nodes
    setChatBoxes([
      ...chatBoxes,
      {
        label: name,
        chat: chat,
        key: name,
        participants: [...students, ...teachers],
      },
    ]);
    setAllQuiz([
      ...allQuiz,
      {
        label: name,
        chat: chat,
        key: name,
        participants: [...students, ...teachers],
      },
    ]);
    setMsgSent(true);
    setModalOpen(false);
  };

  useEffect(() => {
    const chat = renderChat();
    let newChatBoxes = chatBoxes;
    newChatBoxes.forEach((element, index) => {
      const current = isQuiz ? currentQuiz : currentChat;
      if (element.key === current) {
        element.chat = chat;
      }
    });
    setChatBoxes(newChatBoxes);
    setAllQuiz(newChatBoxes.filter((e) => e.quiz === "true"));
    setMsgSent(true);
  }, [messages, pinMsg]);

  const handleOnChange = (key) => {
    if (key) {
      if (isQuiz) {
        setCurrentQuiz(key);
      } else {
        setCurrentChat(key);
      }
      const chat = renderChat();
      let newChatBoxes = chatBoxes;
      newChatBoxes.forEach((element, index) => {
        if (element.key === key) {
          element.chat = chat;
        }
      });
      setChatBoxes(newChatBoxes);
      if (isQuiz) {
        setAllQuiz(newChatBoxes.filter((e) => e.quiz === "true"));
      } else {
        // setAllBox(newChatBoxes.filter((e) => e.quiz === "true"));
      }
    }
  };
  useEffect(() => {
    //console.log("set all Box", ...chatBoxes.filter((c) => c.quiz === "false"));
    if (isQuiz) setAllQuiz([...chatBoxes.filter((c) => c.quiz === "true")]);
  }, [chatBoxes, user]);
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
            } else {
              handleOnChange(e.key);
            }
          }}
          style={{ width: 128, justifyItems: "center" }}
          defaultSelectedKeys={[isQuiz ? currentQuiz : currentChat]}
          selectedKeys={[isQuiz ? currentQuiz : currentChat]}
          // defaultOpenKeys={[isQuiz? currentQuiz:currentChat]}
          mode="inline"
          items={isQuiz ? [...allQuiz, { key: "_add_", label: "+" }] : []}
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
                  groupName={
                    allQuiz.find((b) => b.key === currentQuiz)?.label
                    //   allBox.find((b) => b.key === currentChat)
                  }
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
                  {isQuiz
                    ? allQuiz.find((b) => b.key === currentQuiz)
                      ? allQuiz?.find((b) => b.key === currentQuiz).chat !== {}
                        ? allQuiz?.find((b) => b.key === currentQuiz).chat
                        : "no messages"
                      : "no messages"
                    : "no messages"}
                  <FootRef ref={msgFooter} />
                </div>
                <ChatModal
                  me={user.studentID}
                  open={modalOpen}
                  isTeacher={user.isTeacher}
                  onCreate={({
                    name,
                    groupShow,
                    students,
                    progress,
                    teachers,
                    question,
                  }) => {
                    console.log("students", students);
                    console.log("teachers", teachers);
                    createChatBox({
                      name,
                      groupShow,
                      students,
                      progress,
                      teachers,
                      question,
                    });
                    setModalOpen(false);
                  }}
                  onCancel={() => {
                    setModalOpen(false);
                  }}
                  users={attendants}
                  isQuiz={isQuiz}
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
                          to: isQuiz ? currentQuiz : currentChat,
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
      </Layout>
    </Content>
  );
};

export default Chatbox;
