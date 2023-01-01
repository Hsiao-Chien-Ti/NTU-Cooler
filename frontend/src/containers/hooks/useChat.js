import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import {
  CHATBOX_QUERY,
  CREATE_CHATBOX_MUTATION,
  MESSAGE_SUBSCRIPTION,
  CREATE_MESSAGE_MUTATION,
  CHATBOX_OF_USER_QUERY,
} from "../../graphql";
import { useState, useEffect, useContext, createContext } from "react";
import { message } from "antd";

import { makeName } from "./functions";
import { useAll } from "./useAll";

const LOCALSTORAGE_KEY = "save-me";
const savedMe = localStorage.getItem(LOCALSTORAGE_KEY);

const ChatContext = createContext({
  me: "",
  //friend: "",
  currentChat: "",
  messages: [],
  me: false,
  setMe: () => {},
  //status: {},
  chatBoxData: {},
  chatBoxLoading: false,
  listOfChatboxes: [],
  listLoading: false,
  startChat: () => {},
  sendMessage: () => {},
  clearMessages: () => {},
  setMessages: () => {},
  subscribeToMore: () => {},
  displayStatus: () => {},
  setStatus: () => {},
  createGroup: () => {},
  setCurrentChat: () => {},
});
const ChatProvider = (props) => {
  //const [me, setMe] = useState(savedMe || "");
  const { user, courseID } = useAll();
  const [me, setMe] = useState(true);
  const [currentChat, setCurrentChat] = useState("");
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [allRooms, setAllRooms] = useState([]);
  const {
    data: chatBoxData,
    loading: chatBoxLoading,
    subscribeToMore,
    error,
    refetch,
  } = useQuery(CHATBOX_QUERY, {
    variables: {
      name: currentChat,
      courseID,
      studentID: user.studentID,
    },
  });
  const { data: listOfChatboxes, loading: listLoading } = useQuery(
    CHATBOX_OF_USER_QUERY,
    {
      variables: {
        studentID: user.studentID,
        courseID,
      },
    }
  );

  const [startChat] = useMutation(CREATE_CHATBOX_MUTATION);
  const [sendMessage] = useMutation(CREATE_MESSAGE_MUTATION);
  const displayStatus = (s) => {
    console.log("STATUS");
    if (s.msg) {
      const { type, msg } = s;
      const content = {
        content: msg,
        duration: 0.5,
      };
      switch (type) {
        case "success":
          message.success(content);
          break;
        case "error":
          message.error(content);
          break;
        default:
          message.info(content);
          break;
      }
    }
  };

  useEffect(() => {
    displayStatus(status);
  }, [status]);
  useEffect(() => {
    if (error) {
      throw new Error(error);
    }
    console.log(me, " ", currentChat);
    if (chatBoxData) {
      console.log("DATA: ", chatBoxData);
      if (chatBoxData.chatbox && currentChat)
        setMessages(chatBoxData.chatbox.messages);
    }
  }, [chatBoxData]);
  useEffect(() => {
    if (currentChat) {
      console.log("!!!!!" + currentChat);
      refetch({
        name: currentChat,
        courseID,
        studentID: user.studentID,
      });
      if (error) {
        throw new Error(error);
      }
      if (chatBoxLoading) {
        console.log("loading");
      }
      //console.log("DATA");
      console.log(chatBoxData);
      if (chatBoxData) {
        console.log("reset message");
        setMessages(chatBoxData.chatbox.messages);
      }
      if (!allRooms.includes(currentChat)) {
        try {
          setAllRooms([...allRooms, currentChat]);
          subscribeToMore({
            document: MESSAGE_SUBSCRIPTION,
            variables: { to: currentChat, courseID },
            updateQuery: (prev, { subscriptionData }) => {
              if (!subscriptionData.data) {
                console.log("no data");
                return prev;
              }
              const newSender = subscriptionData.data.message.sender;
              const newBody = subscriptionData.data.message.body;
              //console.log("test: " + newMessage);
              const newMessage = { sender: newSender, body: newBody };
              console.log(newMessage);
              console.log("prev: ", prev);
              // if (!prev.chatbox)
              //   return {
              //     chatbox: {
              //       name: makeName(me, friend),
              //       messages: [newMessage],
              //     },
              //   };
              return {
                chatbox: {
                  name: currentChat,
                  messages: [...prev.chatbox.messages, newMessage],
                },
              };
            },
          });
        } catch (e) {
          console.log("subscribe error: " + e);
        }
      }
    }
  }, [currentChat, chatBoxData, chatBoxLoading]);
  const sendData = (settings) => {};
  const createGroup = () => {
    sendData({ type: "USER", payload: {} });
  };

  useEffect(() => {
    localStorage.setItem(LOCALSTORAGE_KEY, "KKK");
  }, [me]);
  return (
    <ChatContext.Provider
      value={{
        //status,
        setMe,
        me,
        allRooms,
        chatBoxLoading,
        currentChat,
        listOfChatboxes,
        listLoading,
        setCurrentChat,
        messages,
        chatBoxData,
        setStatus,
        sendMessage,
        displayStatus,
        startChat,
        setMessages,
        subscribeToMore,
        createGroup,
      }}
      {...props}
    />
  );
};

const useChat = () => useContext(ChatContext);

export { ChatProvider, useChat };
