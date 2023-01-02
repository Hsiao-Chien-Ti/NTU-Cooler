import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import {
  CHATBOX_QUERY,
  CREATE_CHATBOX_MUTATION,
  MESSAGE_SUBSCRIPTION,
  CREATE_MESSAGE_MUTATION,
  CHATBOX_OF_USER_QUERY,
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

  const { data: listOfChatboxes, loading: listLoading } = useQuery(
    CHATBOX_OF_USER_QUERY,
    {
      variables: {
        studentID: user.studentID,
        courseID,
      },
    }
  );

  const [
    queryChat,
    {
      data: chatBoxData,
      loading: chatBoxLoading,
      subscribeToMore,
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
    // console.log("error sending msg: ", errorSendMsg);
  }, [errorSendMsg]);
  useEffect(() => {
    console.log(access);
  }, [access]);

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
        console.log("pin before refetch:", pinMsg);

        try {
          setAllRooms([...allRooms, currentChat]);
          // console.log("TEST");
          subscribeToMore({
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
              console.log(newMessage);
              console.log(pinMsg);
              console.log();
              console.log("prev: ", prev);
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
  }, [subscribeToMore, currentChat]);

  useEffect(() => {
    if (!listLoading) {
      // console.log("Query_listOfChatboxes:", listOfChatboxes);
      let newChatBoxes = [];
      // console.log(listOfChatboxes);
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
      }}
      {...props}
    />
  );
};

const useChat = () => useContext(ChatContext);

export { ChatProvider, useChat };
