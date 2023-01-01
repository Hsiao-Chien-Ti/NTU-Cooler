const Subscription = {
  syllabus: {
    subscribe: (parent, args, { pubsub }) => {
      return pubsub.subscribe("SYLLABUS");
    },
  },
  announcement: {
    subscribe: (parent, args, { pubsub }) => {
      return pubsub.subscribe("ANNOUNCEMENT");
    },
  },
  file: {
    subscribe: (parent, args, { pubsub }) => {
      console.log(pubsub);
      return pubsub.subscribe("FILE");
    },
  },
  grade: {
    subscribe: (parent, { studentID, subject }, { pubsub }) => {
      console.log(studentID);
      return pubsub.subscribe("GRADE");
    },
  },
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
export default Subscription;
