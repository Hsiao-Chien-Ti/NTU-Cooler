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
  const {
    messages,
    isQuiz,
    currentQuiz,
    chatBoxLoading,
    pinMsg,
    access,
    setPinMsg,
    createQuiz,
    sendMessage,
    allQuiz,
    setAllQuiz,
    setCurrentQuiz,
    changePin,
    quiz,
    setQuiz,
    groupShow,
    setGroupShow,
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
    console.log("renderChat: ", currentQuiz);
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
                isPin={true}
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
                        pinMsg: -1,
                        studentID: user.studentID,
                      },
                    });
                    setPinMsg(-1);
                  }
                }}
              />
            </div>
          ) : (
            <Message
              isMe={mes.sender.studentID === user.studentID ? true : false}
              sender={mes.sender}
              isPin={false}
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
    progress,
    groupShow,
    students,
    teachers,
    name,
    question,
  }) => {
    if (allQuiz.some(({ key }) => key === name)) {
      setStatus({ type: "error", msg: name + " has exist" });
    } else {
      try {
        await createQuiz({
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
        let chat = [];
        if (name === currentQuiz) {
          chat = renderChat(); //turn msgs into DOM nodes
        }

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
        setMsgSent(true);
        setModalOpen(false);
        console.log("Start Quiz with " + name);
      } catch (e) {
        throw new Error("Mutation_createQuiz_error", e);
      }
    }
  };

  useEffect(() => {
    console.log("Message / pinMsg / isQuiz Changed!");
    console.log(isQuiz);
    if (isQuiz) {
      console.log("useEffect with messages/pinMsg");
      const chat = renderChat();
      console.log(chat);
      let newChatBoxes = allQuiz;
      newChatBoxes.forEach((element, index) => {
        if (element.key === currentQuiz) {
          element.chat = chat;
        }
      });
      setAllQuiz(newChatBoxes);
      setMsgSent(true);
    }
  }, [messages, pinMsg, isQuiz]);

  const handleOnChange = (key) => {
    if (key) {
      setCurrentQuiz(key);
      console.log("HANDLEONCHANGE");
      let chat = [];
      if (key === currentQuiz) {
        chat = renderChat();
      }
      let newChatBoxes = allQuiz;
      newChatBoxes.forEach((element, index) => {
        if (element.key === key) {
          element.chat = chat;
        }
      });
      setAllQuiz(newChatBoxes);
    }
  };

  return (
    <Content
      style={{
        overflow: "auto",
        minHeight: "40em",
      }}>
      <Layout style={{ disaply: "flex", flexDirection: "row", padding: 0 }}>
        <Menu
          onClick={(e) => {
            if (e.key === "_add_") {
              setModalOpen(true);
              console.log(user.isTeacher);
            } else handleOnChange(e.key);
          }}
          style={{ width: "10em", background: "fbf3e6" }}
          defaultSelectedKeys={[currentQuiz]}
          selectedKeys={[currentQuiz]}
          // defaultOpenKeys={[isQuiz? currentQuiz: currentQuiz]}
          mode="inline"
          items={
            user.isTeacher
              ? [...allQuiz, { key: "_add_", label: "+" }]
              : allQuiz
          }
          theme="light"
        />
        {/* </Sider> */}
        {/* <Layout className="site-layout"> */}
        <Content style={{ margin: "0px 16px" }}>
          <div
            style={{
              flexDirection: "column",
            }}>
            {!chatBoxLoading ? (
              <div>
                <ChatboxHeader
                  isPin={pinMsg !== -1}
                  msg={
                    pinMsg === -1 ? "no pinned message" : messages[pinMsg]?.body
                  }
                  groupName={allQuiz.find((b) => b.key === currentQuiz)?.label}
                  color={colorBgContainer}
                  style={{ height: "8em" }}
                  handlePinOnClick={handlePinOnClick}
                />

                <div style={{ height: "16px" }}></div>
                <div
                  style={{
                    padding: 20,
                    overflow: "auto",
                    height: "28em",
                    background: colorBgContainer,
                  }}>
                  {allQuiz.find((b) => b.key === currentQuiz)
                    ? allQuiz.find((b) => b.key === currentQuiz).chat !== {}
                      ? allQuiz.find((b) => b.key === currentQuiz).chat
                      : "no messages"
                    : "no messages"}
                </div>

                <ChatModal
                  me={user.studentID}
                  open={modalOpen}
                  isTeacher={user.isTeacher}
                  onCreate={async ({
                    progress,
                    groupShow,
                    students,
                    teachers,
                    name,
                    question,
                  }) => {
                    await createChatBox({
                      progress,
                      groupShow,
                      students,
                      teachers,
                      name,
                      question,
                    });
                  }}
                  onCancel={() => {
                    setModalOpen(false);
                  }}
                  isQuiz={true}
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
                    disabled={currentQuiz ? false : true}
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
                          groupNum: groupShow ? user.groupNum : -1,
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
