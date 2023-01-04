import { useChat } from "../../containers/hooks/useChat";
const FootRef = styled.div`
  height: 20px;
`;
const ChatBox = (isQuiz, allBox, handleSetCurrent, current) => {
  const { setStatus, attendants, allStudents, user } = useAll();
  const {
    messages,
    chatBoxes,
    chatBoxLoading,
    pinMsg,
    access,
    setPinMsg,
    setChatBoxes,
    startChat,
    sendMessage,
    queryChatBox,
    changePin,
  } = useChat();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [body, setBody] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [msgSent, setMsgSent] = useState(false);
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
  useEffect(() => {
    console.log("messages use effect with messages:", messages);
    console.log("current chat:", current);
    const chat = renderChat();
    let newChatBoxes = chatBoxes;
    newChatBoxes.forEach((element, index) => {
      if (element.key === current) {
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
    console.log("pinMsg use effect with pinChange:", pinMsg);
    console.log("current chat:", current);
    const chat = renderChat();
    let newChatBoxes = chatBoxes;
    newChatBoxes.forEach((element, index) => {
      if (element.key === current) {
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
      handleSetCurrent(key);
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
  const renderChat = () => {
    console.log("renderChat");
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
        <FootRef ref={msgFooter} />
      </>
    );
  }; //produce chat's DOM nodes

  const createChatBox = async ({ name, participants, quiz }) => {
    let newName = name;
    if (participants.length === 2) {
      newName = participants.filter((p) => p !== user.studentID)[0];
    }
    if (chatBoxes.some(({ key }) => key === name)) {
      handleSetCurrent(name);
      setStatus({ type: "error", msg: newName + "has exist" });
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
        handleSetCurrent(name);
      } catch (e) {
        throw new Error("Mutation_createChatBox_error", e);
      }
      const chat = renderChat(); //turn msgs into DOM nodes
      setChatBoxes([
        ...chatBoxes,
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
    }
  };
  chatBoxes, user, modalOpen, attendants, sendMessage, access;
  return (
    <Layout style={{ flexDirection: "row" }}>
      <Menu
        onClick={(e) => {
          if (e.key === "_add_") {
            setModalOpen(true);
            console.log(user.isTeacher);
          } else handleOnChange(e.key);
        }}
        style={{ width: 128, justifyItems: "center" }}
        defaultSelectedKeys={[current]}
        selectedKeys={[current]}
        // defaultOpenKeys={[current]}
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
                groupName={allBox.find((b) => b.key === current)?.label}
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
                {allBox.find((b) => b.key === current)
                  ? allBox.find((b) => b.key === current).chat !== {}
                    ? allBox.find((b) => b.key === current).chat
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
                        to: current,
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
  );
};

export default ChatBox;
