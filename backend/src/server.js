import { createPubSub, createSchema, createYoga } from "graphql-yoga";
import { createServer } from "node:http";
import { useServer } from "graphql-ws/lib/use/ws";
import { WebSocketServer } from "ws";
import * as fs from "fs";
// models
import UserModel from "./models/user";
import SyllabusModel from "./models/syllabus";
import AnnouncementModel from "./models/announcement";
import GradeModel from "./models/grade";
import FileModel from "./models/file";
import ChatBoxModel from "./models/chatbox";
import InfoModel from "./models/info";
import HWModel from "./models/hw";
import QuizModel from "./models/quiz";
// graphql
import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import Subscription from "./resolvers/Subscription";

const pubsub = createPubSub();

const yoga = createYoga({
  schema: createSchema({
    typeDefs: fs.readFileSync("./src/schema.graphql", "utf-8"),
    resolvers: {
      Query,
      Mutation,
      Subscription,
    },
  }),
  context: {
    UserModel,
    SyllabusModel,
    AnnouncementModel,
    GradeModel,
    FileModel,
    InfoModel,
    HWModel,
    ChatBoxModel,
    QuizModel,
    pubsub,
  },
  // graphqlEndpoint: '/',   // uncomment this to send the app to: 4000/ otherwise: 4000/graphql
  graphiql: {
    subscriptionsProtocol: "WS",
  },
});

const httpServer = createServer(yoga);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: yoga.graphqlEndpoint,
});

useServer(
  {
    execute: (args) => args.rootValue.execute(args),
    subscribe: (args) => args.rootValue.subscribe(args),
    onSubscribe: async (ctx, msg) => {
      const { schema, execute, subscribe, contextFactory, parse, validate } =
        yoga.getEnveloped({
          ...ctx,
          req: ctx.extra.request,
          socket: ctx.extra.socket,
          params: msg.payload,
        });

      const args = {
        schema,
        operationName: msg.payload.operationName,
        document: parse(msg.payload.query),
        variableValues: msg.payload.variables,
        contextValue: await contextFactory(),
        rootValue: {
          execute,
          subscribe,
        },
      };

      const errors = validate(args.schema, args.document);
      if (errors.length) return errors;
      return args;
    },
  },
  wsServer
);

export default httpServer;
