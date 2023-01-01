const Subscription = {
  message: {
    subscribe: (parent, { to, courseID }, { db, pubsub }) => {
      return pubsub.subscribe(`chatBox ${to} in class ${courseID}`);
    },
  },
};
export { Subscription as default };
//
