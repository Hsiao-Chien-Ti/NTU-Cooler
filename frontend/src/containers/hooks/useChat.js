import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import {
  CHATBOX_QUERY,
  CREATE_CHATBOX_MUTATION,
  MESSAGE_SUBSCRIPTION,
  CREATE_MESSAGE_MUTATION,
} from "../../graphql";
import { useState, useEffect, useContext, createContext } from "react";
import { message } from "antd";

import { makeName } from "./functions";

const LOCALSTORAGE_KEY = "save-me";
const savedMe = localStorage.getItem(LOCALSTORAGE_KEY);

const ChatContext = createContext({
  me: "",
  friend: "",
  messages: [],
  //status: {},
  signedIn: false,
  users: [],
  data: {},
  loading: false,
  startChat: () => {},
  sendMessage: () => {},
  clearMessages: () => {},
  setMessages: () => {},
  subscribeToMore: () => {},
  displayStatus: () => {},
  setStatus: () => {},
  createGroup: () => {},
  setFriend: () => {},
});
const ChatProvider = (props) => {
  //const [me, setMe] = useState(savedMe || "");
  const [me, setMe] = useState("k");
  const [friend, setFriend] = useState("");
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [signedIn, setSignedIn] = useState(false);
  const [users, setUsers] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const { data, loading, subscribeToMore, refetch } = useQuery(CHATBOX_QUERY, {
    variables: {
      name: makeName(me, friend),
    },
  });

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
    console.log(me, " ", friend);
    if (data) {
      console.log("DATA: ", data);
      if (data.chatbox && friend) setMessages(data.chatbox.messages);
    }
  }, [data]);
  useEffect(() => {
    if (friend) {
      console.log(me + "!!!!!" + friend);
      refetch({
        name: makeName(me, friend),
      });
      //console.log("DATA");
      if (data) {
        console.log("reset message");
        setMessages(data.chatbox.messages);
      }
      if (!allRooms.includes(friend)) {
        try {
          setAllRooms([...allRooms, friend]);
          subscribeToMore({
            document: MESSAGE_SUBSCRIPTION,
            variables: { from: me, to: friend, courseID },
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
                  name: makeName(me, friend),
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
  }, [friend]);
  const sendData = (settings) => {};
  const createGroup = () => {
    sendData({ type: "USER", payload: {} });
  };
  // const startChat = (name, settings) => {
  //   if (settings.chatRoomName) {
  //     console.log("start group chat");
  //     if (!name || !settings) throw new Error("Name or Settings required.");
  //     sendData({ type: "CHAT_GROUP", payload: { name, settings } });
  //     client.box = settings.chatRoomName;

  //     //console.log(client.box);
  //   } else {
  //     console.log("start 1-1");
  //     console.log(client.box);
  //     let to = settings.name;
  //     if (!name || !to) throw new Error("Name or To required.");
  //     sendData({ type: "CHAT", payload: { name, to } });
  //     client.box = to;
  //   }
  // };
  // const sendMessage = async (name, to, body) => {
  //   console.log(name, to, body);
  //   if (!name || !to || !body) throw new Error("Name or To or Body required.");
  //   await sendData({ type: "MESSAGE", payload: { name, to, body } });
  // };
  // const clearMessages = (name) => {
  //   sendData({ type: "CLEAR", payload: { name } });
  // };
  useEffect(() => {
    if (signedIn) {
      localStorage.setItem(LOCALSTORAGE_KEY, me);
    }
  }, [me, signedIn]);
  return (
    <ChatContext.Provider
      value={{
        //status,
        users,
        me,
        friend,
        signedIn,
        messages,
        data,
        loading,
        setMe,
        setSignedIn,
        setStatus,
        sendMessage,
        displayStatus,
        startChat,
        setMessages,
        subscribeToMore,
        createGroup,
        setFriend,
      }}
      {...props}
    />
  );
};

const useChat = () => useContext(ChatContext);

export { ChatProvider, useChat };
