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
const Chatbox = () => {
  const {
    chatBoxLoading,
    pinMsg,
    messages,
    chatBoxes,
    queryChatBox,
    isQuiz,
    sendMessage,
    startChat,
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
  const [allBox, setAllBox] = useState([]);
  const [current, setCurrent] = useState("");
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

  useEffect(() => {
    if (isQuiz) {
      setCurrent(currentQuiz);
    } else {
      setCurrent(currentChat);
    }
  }, [isQuiz, currentChat, currentQuiz]);
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
    students,
    teachers,
    name,
    participants,
    question,
  }) => {
    if (isQuiz) {
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
          quiz: "true",
          participants: [...students, ...teachers],
        },
      ]);
      setAllQuiz([
        ...allQuiz,
        {
          label: name,
          chat: chat,
          key: name,
          quiz: "true",
          participants: [...students, ...teachers],
        },
      ]);
    } else {
      let newName = name;
      if (participants.length === 2) {
        newName = participants.filter((p) => p !== user.studentID)[0];
      }
      if (chatBoxes.some(({ key }) => key === name)) {
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
              type: false,
            },
          });
          console.log("Mutation_createChatBox:", name);

          setCurrentChat(name);
          const chat = renderChat(); //turn msgs into DOM nodes
          setChatBoxes([
            ...chatBoxes,
            {
              label: newName,
              chat: chat,
              key: name,
              quiz: "false",
              participants: participants,
            },
          ]);
          setAllBox([
            ...allBox,
            {
              label: newName,
              chat: chat,
              key: name,
              quiz: "false",
              participants: participants,
            },
          ]);
          console.log("Start Chat with " + newName);
        } catch (e) {
          throw new Error("Mutation_createChatBox_error", e);
        }
      }
    }
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
    setAllBox(newChatBoxes.filter((e) => e.quiz === "false"));
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
        setAllBox(newChatBoxes.filter((e) => e.quiz === "false"));
      }
    }
  };
  useEffect(() => {
    //console.log("set all Box", ...chatBoxes.filter((c) => c.quiz === "false"));
    if (user.studentID) {
      if (isQuiz) {
        setAllQuiz(chatBoxes.filter((c) => c.quiz === "true"));
      } else {
        setAllBox(chatBoxes.filter((c) => c.quiz === "false"));
      }
    }
  }, [chatBoxes, user, isQuiz]);
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
          items={
            isQuiz
              ? user.isTeacher
                ? [...allQuiz, { key: "_add_", label: "+" }]
                : allQuiz
              : [...allBox, { key: "_add_", label: "+" }]
          }
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
                  groupName={current}
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
                    ? currentQuiz
                      ? allQuiz.find((b) => b.key === currentQuiz)
                        ? allQuiz?.find((b) => b.key === currentQuiz).chat !==
                          {}
                          ? allQuiz?.find((b) => b.key === currentQuiz).chat
                          : "no messages"
                        : "no messages"
                      : "no messages"
                    : currentChat
                    ? allBox.find((b) => b.key === currentChat)
                      ? allBox?.find((b) => b.key === currentChat).chat !== {}
                        ? allBox?.find((b) => b.key === currentChat).chat
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
                    participants,
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
                      participants,
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
