import { useAll } from "./hooks/useAll";
import styled from "styled-components";
import SignIn from "./SignIn";
import Homepage from "./Homepage";
import Syllabus from "./Syllabus";
import Grade from "./Grade";
import Files from "./Files";
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
    ],
  },
]);
const App = () => {
  const { user } = useAll();
  return <RouterProvider router={router} />;
};

export default App;
