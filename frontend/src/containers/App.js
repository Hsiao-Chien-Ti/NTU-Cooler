import { useAll } from "./hooks/useAll";
import styled from "styled-components";
import SignIn from "./SignIn";
import Homepage from "./Homepage";
import Syllabus from "./Syllabus";
import Grade from "./Grade";
import Files from "./Files";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Announcement from "./Announcement";
import ChatRoom from "./Chatbox";
// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <SignIn />,
//   },
//   {
//     path: "/course",
//     element: <Page />,
//     children: [
//       {
//         path: "/course/homepage",
//         element: <Homepage />,
//       },
//       {
//         path: "/course/homepage",
//         element: <Homepage />,
//       },
//       {
//         path: "/course/syllabus",
//         element: <Syllabus />,
//       },
//       {
//         path: "/course/announcement",
//         element: <Announcement />,
//       },
//       {
//         path: "/course/grade",
//         element: <Grade />,
//       },
//       {
//         path: "/course/files",
//         element: <Files />,
//       },
//       {
//         path: "/course/message",
//         element: <ChatRoom />,
//         children: [],
//       },
//     ],
//   },
// ]);
// const App = () => {
//   const { user } = useAll();
//   return <RouterProvider router={router} />;
// };
const App = () => {
  const { user } = useAll();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/syllabus" element={<Syllabus />} />
        <Route path="/announcement" element={<Announcement />} />
        <Route path="/grade" element={<Grade />} />
        <Route path="/chatroom" element={<ChatRoom />} />
        <Route path="/files" element={<Files />} />
      </Routes>
    </Router>
  );
};

export default App;
