import React from "react";
import ReactDOM from "react-dom/client";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  split,
  HttpLink,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { AllProvider } from "./containers/hooks/useAll";
import App from "./containers/App";
import reportWebVitals from "./reportWebVitals";
import { ChatProvider } from "./containers/hooks/useChat";
import { QuizProvider } from "./containers/hooks/useQuiz";
const httpLink = new HttpLink({
  uri:   process.env.NODE_ENV === "production"
  ? "https://ntu-cooler.onrender.com/graphql"
  : "http://localhost:4000/graphql"
,
});
const wsLink = new GraphQLWsLink(
  createClient({
    url:   process.env.NODE_ENV === "production"
    ? "wss://ntu-cooler.onrender.com/graphql"
    : "ws://localhost:4000/graphql",
    options: {
      lazy: true,
    },
  })
);
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AllProvider>
        <ChatProvider>
          <QuizProvider>
            <App />
          </QuizProvider>
        </ChatProvider>
      </AllProvider>
    </ApolloProvider>
  </React.StrictMode>
);
reportWebVitals();
