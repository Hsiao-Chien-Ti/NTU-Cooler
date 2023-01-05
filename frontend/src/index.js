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
const { YogaLink } = require("@graphql-yoga/apollo-link");

const client = new ApolloClient({
  link: new YogaLink({
    endpoint: process.env.NODE_ENV === 'production' 
      ? '/graphql'
      : 'http://localhost:4000/graphql'
  }),
  cache: new InMemoryCache(),
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AllProvider>
        <ChatProvider>
            <App />
        </ChatProvider>
      </AllProvider>
    </ApolloProvider>
  </React.StrictMode>
);
reportWebVitals();
