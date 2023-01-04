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
import Chatbox from "../components/Chatbox/ChatboxContent";
import { useQuiz } from "./hooks/useQuiz";
const { Content, Footer } = Layout;

const Quiz = () => {
  return <Chatbox isQuiz={true} />;
};
export default Quiz;
