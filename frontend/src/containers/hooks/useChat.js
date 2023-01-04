import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import {
  CHATBOX_QUERY,
  CREATE_CHATBOX_MUTATION,
  MESSAGE_SUBSCRIPTION,
  CREATE_MESSAGE_MUTATION,
  CHATBOX_OF_USER_QUERY,
  CHATBOXLIST_SUBSCRIPTION,
  PINMSG_MUTATION,
} from "../../graphql";
import { useState, useEffect, useContext, createContext } from "react";
import { useAll } from "./useAll";

const ChatContext = createContext({
  currentChat: "",
  messages: [],
  chatBoxes: [],
  chatBoxLoading: false,
  pinMsg: 0,
  access: false,
  setPinMsg: () => {},
  setCurrentChat: () => {},
  setMessages: () => {},
  setChatBoxes: () => {},
  startChat: () => {},
  sendMessage: () => {},
  queryChat: () => {},
  queryChatBox: () => {},
  changePin: () => {},
});
const ChatProvider = (props) => {
  const { user, courseID } = useAll();
  const [currentChat, setCurrentChat] = useState("");
  const [messages, setMessages] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [chatBoxes, setChatBoxes] = useState([]);
  const [pinMsg, setPinMsg] = useState(0);
  const [access, setAccess] = useState(false);
  const [startChat] = useMutation(CREATE_CHATBOX_MUTATION);
  const [sendMessage, { error: errorSendMsg }] = useMutation(
    CREATE_MESSAGE_MUTATION
  );
  const [changePin] = useMutation(PINMSG_MUTATION);

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
  });

  const [
    queryChat,
    {
      data: chatBoxData,
      loading: chatBoxLoading,
      subscribeToMore: subscribeNewMessage,
      error,
      refetch,
    },
  ] = useLazyQuery(CHATBOX_QUERY, {
    variables: {
      name: currentChat,
      courseID,
      studentID: user.studentID,
    },
    fetchPolicy: "network-only",
  });
  useEffect(() => {
    console.log("error sending msg: ", errorSendMsg);
  }, [errorSendMsg]);
  // useEffect(() => {
  //   console.log(access);
  // }, [access]);

  useEffect(() => {
    if (error) {
      throw new Error("Query_chatBoxData_error:", error);
    }
    if (!chatBoxLoading) {
      // console.log("Query_chatBoxData:", chatBoxData);
      if (chatBoxData) {
        setMessages(chatBoxData.chatbox.messages);
        setPinMsg(chatBoxData.chatbox.pinMsg);
        console.log(user.studentID, chatBoxData.chatbox);
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
  }, [chatBoxData]);

  useEffect(() => {
    if (currentChat) {
      if (!allRooms.includes(currentChat)) {
        console.log("pin before refetch:", pinMsg, "in ", currentChat);

        try {
          setAllRooms([...allRooms, currentChat]);
          // console.log("TEST");
          subscribeNewMessage({
            document: MESSAGE_SUBSCRIPTION,
            variables: { to: currentChat, courseID: courseID },
            updateQuery: (prev, { subscriptionData }) => {
              if (!subscriptionData.data) {
                // console.log("no data");
                return prev;
              }
              // console.log(subscriptionData);
              refetch({
                name: currentChat,
                courseID,
                studentID: user.studentID,
              });
              const newMessage = subscriptionData.data.message;
              return {
                chatbox: {
                  name: currentChat,
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
  }, [subscribeNewMessage, currentChat]);

  useEffect(() => {
    // if (currentChat) {
    //   if (!allRooms.includes(currentChat)) {
    //     console.log("pin before refetch:", pinMsg);
    if (user)
      try {
        // setAllRooms([...allRooms, currentChat]);
        subscribeChatBoxList({
          document: CHATBOXLIST_SUBSCRIPTION,
          variables: { courseID },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev;
            }
            refetchChatBoxList({
              studentID: user.studentID,
              courseID,
            });
          },
        });
        console.log("New Chat!");
        // console.log("AllRoom: ", allRooms);
      } catch (e) {
        throw new Error("subscribe error: " + e);
      }
  }, [subscribeChatBoxList]);

  useEffect(() => {
    if (!listLoading) {
      // console.log("Query_listOfChatboxes:", listOfChatboxes);
      let newChatBoxes = [];
      // console.log(listOfChatboxes);
      if (listOfChatboxes) {
        listOfChatboxes.userChatbox.forEach((room) => {
          newChatBoxes.push({
            key: room.name,
            label: room.showName,
            chat: [],
          });
          // console.log(newChatBoxes);
        });
        setChatBoxes(newChatBoxes);
        if (currentChat === "")
          setCurrentChat(listOfChatboxes.userChatbox[0].name);
      }
    }
  }, [listOfChatboxes]);

  return (
    <ChatContext.Provider
      value={{
        //status,
        chatBoxLoading,
        currentChat,
        messages,
        chatBoxes,
        chatBoxLoading,
        pinMsg,
        access,
        setPinMsg,
        setCurrentChat,
        setMessages,
        setChatBoxes,
        startChat,
        sendMessage,
        queryChat,
        queryChatBox,
        changePin,
      }}
      {...props}
    />
  );
};

const useChat = () => useContext(ChatContext);

export { ChatProvider, useChat };
