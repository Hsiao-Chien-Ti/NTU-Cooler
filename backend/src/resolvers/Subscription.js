const Subscription = {
  message: {
    subscribe: (parent, { to, courseID }, { db, pubsub }) => {
      const chatbox = db.chatboxes.find(
        (box) => box.name === to && box.courseID === courseID && box.published
      );

      if (!chatbox) {
        throw new Error("Post not found");
      }
      console.log(`chatBox ${to} in class ${courseID}`);
      return pubsub.subscribe(`chatBox ${to} in class ${courseID}`);
    },
  },
};
export { Subscription as default };
//
