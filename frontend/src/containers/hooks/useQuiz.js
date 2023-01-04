import { createContext, useContext, useEffect, useState } from "react";
import { useAll } from "./useAll";
import { useChat } from "./useChat";
const QuizContext = createContext({
  allQuiz: [],
  setAllQuiz: () => {},
  createChatBox: () => {},
});

const QuizProvider = (props) => {
  const [allQuiz, setAllQuiz] = useState([]);
  const { user, courseID, setStatus } = useAll();
  const { chatBoxes, setCurrentQuiz, createQuiz } = useChat();
  const createChatBox = async ({
    name,
    groupShow,
    students,
    progress,
    teachers,
    question,
  }) => {
    if (chatBoxes.some(({ key }) => key === name)) {
      setStatus({ type: "error", msg: name + " has exist" });
    } else {
      try {
        createQuiz({
          variables: {
            progress,
            groupShow,
            courseID,
            students,
            teachers,
            name,
            question,
          },
        });
        console.log("Mutation_createQuiz:", name);
        setCurrentQuiz(name);
      } catch (e) {
        throw new Error("Mutation_createChatBox_error", e);
      }
      console.log("QUIZ" + name);
    }
  };
  useEffect(() => {
    if (user.isTeacher) {
      setAllQuiz([
        ...chatBoxes.filter((c) => c.quiz === "true"),
        { key: "_add_", label: "+" },
      ]);
    } else {
      setAllQuiz([...chatBoxes.filter((c) => c.quiz === "true")]);
    }
  }, [chatBoxes]);
  return (
    <QuizContext.Provider
      value={{ allQuiz, setAllQuiz, createChatBox }}
      {...props}
    />
  );
};

const useQuiz = () => useContext(QuizContext);

export { QuizProvider, useQuiz };
