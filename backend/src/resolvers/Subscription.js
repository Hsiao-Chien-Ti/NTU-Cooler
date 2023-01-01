const Subscription = {
  message: {
    subscribe: (parent, { to, courseID }, { pubsub }) => {
      return pubsub.subscribe(`chatBox ${to}`);
    },
  },
};
export { Subscription as default };
// in class ${courseID}
