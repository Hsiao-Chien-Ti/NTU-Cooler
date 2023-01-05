import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import {
  CHATBOX_QUERY,
  CREATE_CHATBOX_MUTATION,
  MESSAGE_SUBSCRIPTION,
  CREATE_MESSAGE_MUTATION,
  CHATBOX_OF_USER_QUERY,
  CHATBOXLIST_SUBSCRIPTION,
  PINMSG_MUTATION,
  QUIZ_QUERY,
  CREATE_QUIZ_MUTAION,
} from "../../graphql";
import { useState, useEffect, useContext, createContext } from "react";
import { useAll } from "./useAll";

const ChatContext = createContext({
  currentChat: "",
  currentQuiz: "",
  messages: [],
  chatBoxLoading: false,
  pinMsg: 0,
  access: false,
  isQuiz: false,
  setPinMsg: () => {},
  setCurrentChat: () => {},
  setCurrentQuiz: () => {},
  startChat: () => {},
  sendMessage: () => {},
  queryChat: () => {},
  queryChatBox: () => {},
  changePin: () => {},
  setIsQuiz: () => {},
  createQuiz: () => {},
  allBox: [],
  setAllBox: () => {},
  allQuiz: [],
  setAllQuiz: () => {},
  groupShow: false,
  setGroupShow: () => {},
});
const ChatProvider = (props) => {
  const { user, courseID } = useAll();
  const [currentChat, setCurrentChat] = useState("");
  const [currentQuiz, setCurrentQuiz] = useState("");
  const [allBox, setAllBox] = useState([]);
  const [allQuiz, setAllQuiz] = useState([]);
  const [messages, setMessages] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [pinMsg, setPinMsg] = useState(0);
  const [access, setAccess] = useState(false);
  const [isQuiz, setIsQuiz] = useState(false);
  const [groupShow, setGroupShow] = useState(false);

  const [startChat] = useMutation(CREATE_CHATBOX_MUTATION);
  const [sendMessage, { error: errorSendMsg }] = useMutation(
    CREATE_MESSAGE_MUTATION
  );
  const [changePin] = useMutation(PINMSG_MUTATION);
  const [createQuiz] = useMutation(CREATE_QUIZ_MUTAION);
  const [
    queryChatBox,
    {
      data: listOfChatboxes,
      loading: listLoading,
      subscribeToMore: subscribeChatBoxList,
      refetch: refetchChatBoxList,
    },
  ] = useLazyQuery(CHATBOX_OF_USER_QUERY, {
    variables: {
      studentID: user.studentID,
      courseID,
    },
    fetchPolicy: "network-only",
  });

  const [
    queryChat,
    {
      data: chatBoxData,
      loading: chatBoxLoading,
      subscribeToMore: subscribeNewMessage,
      error,
      refetch: refetchChatBox,
    },
  ] = useLazyQuery(CHATBOX_QUERY, {
    variables: {
      name: isQuiz ? currentQuiz : currentChat,
      courseID,
      studentID: user.studentID,
    },
    fetchPolicy: "network-only",
  });

  const [
    queryQuiz,
    { data: quizData, loading: quizLoading, subscribeToMore: subscribeQuiz },
  ] = useLazyQuery(QUIZ_QUERY, {
    variables: {
      name: currentQuiz,
      studentID: user.studentID,
      courseID,
    },
  });
  useEffect(() => {
    if (errorSendMsg) console.log("error sending msg: ", errorSendMsg);
  }, [errorSendMsg]);
  // useEffect(() => {
  //   console.log(access);
  // }, [access]);

  useEffect(() => {
    if (error) {
      console.log("query chatbox error", error);
      throw new Error("Query_chatBoxData_error:", error);
    }
    if (!chatBoxLoading) {
      console.log("Query_chatBoxData:", chatBoxData);
      if (chatBoxData) {
        setMessages(chatBoxData.chatbox.messages);
        setPinMsg(chatBoxData.chatbox.pinMsg);
        if (chatBoxData.chatbox.notAccess.includes(user.studentID)) {
          setAccess(false);
          console.log("not accessible!");
        } else {
          setAccess(true);
          console.log("accessible!");
        }
        console.log("set pinmsg:", chatBoxData.chatbox.pinMsg);
      }
    }
  }, [chatBoxData, chatBoxLoading]);

  useEffect(() => {
    const current = isQuiz ? currentQuiz : currentChat;
    console.log("subscribe", current);
    if (current && user.studentID) {
      if (!allRooms.includes(current)) {
        try {
          setAllRooms([...allRooms, current]);
          console.log("Add AllRoom: ", current);
          subscribeNewMessage({
            document: MESSAGE_SUBSCRIPTION,
            variables: { to: current, courseID: courseID },
            updateQuery: (prev, { subscriptionData }) => {
              if (!subscriptionData.data) {
                return prev;
              }
              refetchChatBox({
                name: current,
                courseID,
                studentID: user.studentID,
              });
              const newMessage = subscriptionData.data.message;
              return {
                chatbox: {
                  name: current,
                  messages: [...prev.chatbox.messages, newMessage],
                  type: prev.chatbox.type,
                  courseID: courseID,
                  participants: prev.chatbox.participants,
                  notAccess: prev.chatbox.notAccess,
                  pinMsg: prev.chatbox.pinMsg,
                },
              };
            },
          });
          // console.log("AllRoom: ", allRooms);
        } catch (e) {
          throw new Error("subscribe error: " + e);
        }
      }
    }
  }, [subscribeNewMessage, currentChat, currentQuiz, isQuiz]);

  useEffect(() => {
    if (user.studentID) {
      try {
        subscribeChatBoxList({
          document: CHATBOXLIST_SUBSCRIPTION,
          variables: { courseID },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev;
            }
            console.log("CHATBOXLIST_UPDATED");
            refetchChatBoxList({
              studentID: user.studentID,
              courseID,
            });
            return {
              userChatbox: {
                studentID: user.studentID,
                courseID,
                type: isQuiz,
              },
            };
          },
        });
        console.log("New Chat!");
        // console.log("AllRoom: ", allRooms);
      } catch (e) {
        throw new Error("subscribe error: " + e);
      }
    }
  }, [subscribeChatBoxList, user]);

  useEffect(() => {
    if (!listLoading) {
      // console.log("Query_listOfChatboxes:", listOfChatboxes);
      let newChatBoxes = [];
      let newQuizBoxes = [];
      // console.log(listOfChatboxes);
      let newChat = "";
      let newQuiz = "";
      if (listOfChatboxes) {
        listOfChatboxes.userChatbox.forEach((room) => {
          if (room.type) {
            newQuizBoxes.push({
              key: room.name,
              label: room.showName,
              quiz: "true",
              chat: <p style={{ color: "#ccc" }}>No messages...</p>,
            });
            console.log("INSERT NEW CHATBOXES", newQuizBoxes);
            if (newQuiz === "") {
              newQuiz = room.name;
            }
          } else {
            newChatBoxes.push({
              key: room.name,
              label: room.showName,
              quiz: "false",
              chat: <p style={{ color: "#ccc" }}>No messages...</p>,
            });
            console.log("INSERT NEW CHATBOXES", newChatBoxes);
            if (newChat === "") {
              newChat = room.name;
            }
          }
        });
        setAllBox(newChatBoxes);
        setAllQuiz(newQuizBoxes);
        if (currentChat === "") setCurrentChat(newChat);
        if (currentQuiz === "") setCurrentQuiz(newQuiz);
      }
    }
  }, [listOfChatboxes, listLoading, user]);

  useEffect(() => {
    if (!quizLoading) {
      if (quizData) {
        setGroupShow(quizData.quiz.groupShow);
      }
    }
  }, [quizData, quizLoading]);
  useEffect(() => {
    const current = isQuiz ? currentQuiz : currentChat;
    if (current && user.studentID) {
      console.log("Change & Query! Current: ", current);
      queryChat({
        variables: {
          name: current,
          courseID,
          studentID: user.studentID,
        },
      });
      if (isQuiz) {
        queryQuiz({
          variables: {
            name: currentQuiz,
            courseID,
            studentID: user.studentID,
          },
        });
      }
    } else {
      setPinMsg(-1);
    }
  }, [isQuiz, user, courseID, currentChat, currentQuiz]);

  useEffect(() => {
    if (user.studentID)
      queryChatBox({
        variables: {
          courseID,
          studentID: user.studentID,
        },
      });
  }, [user, courseID, isQuiz]);

  return (
    <ChatContext.Provider
      value={{
        //status,
        allQuiz,
        setAllQuiz,
        allBox,
        setAllBox,
        isQuiz,
        setIsQuiz,
        currentChat,
        setCurrentChat,
        currentQuiz,
        setCurrentQuiz,
        pinMsg,
        setPinMsg,
        messages,

        chatBoxLoading,
        access,
        sendMessage,
        queryChat,
        startChat,

        queryChatBox,
        changePin,
        createQuiz,
      }}
      {...props}
    />
  );
};

const useChat = () => useContext(ChatContext);

export { ChatProvider, useChat };
