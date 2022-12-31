import { makeName } from "./functions";

const Subscription = {
  message: {
    subscribe: (parent, { from, to, courseID }, { pubsub }) => {
      return pubsub.subscribe(`chatBox ${to} in class ${courseID}`);
    },
  },
};
export { Subscription as default };
