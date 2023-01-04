import { useAll } from "./hooks/useAll";
import styled from "styled-components";
import SignIn from "./SignIn";
import Homepage from "./Homepage";
import Syllabus from "./Syllabus";
import Grade from "./Grade";
import Files from "./Files";
import ChatRoom from "./Chatbox";
import HW from "./HW";
import Quiz from "./Quiz";
import {
  BrowserRouter as Router,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import Announcement from "./Announcement";
import Page from "../components/Pages";
const router = createBrowserRouter([
  {
    path: "/",
    element: <SignIn />,
  },
  {
    path: "/course",
    element: <Page />,
    children: [
      {
        path: "/course/homepage",
        element: <Homepage />,
      },
      {
        path: "/course/syllabus",
        element: <Syllabus />,
      },
      {
        path: "/course/announcement",
        element: <Announcement />,
      },
      {
        path: "/course/grade",
        element: <Grade />,
      },
      {
        path: "/course/files",
        element: <Files />,
      },
      {
        path: "/course/hw",
        element: <HW />,
      },
      {
        path: "/course/quizzes",
        element: <Quiz />,
      },
      {
        path: "/course/messages",
        element: <ChatRoom />,
      },
    ],
  },
]);
const App = () => {
  const { user } = useAll();
  return <RouterProvider router={router} />;
};

export default App;
