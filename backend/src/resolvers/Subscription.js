const Subscription = {
  syllabus: {
    subscribe: (parent, args, { pubsub }) => {
      console.log(pubsub);
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
      // console.log(pubsub)
      return pubsub.subscribe("FILE");
    },
  },
  grade: {
    subscribe: (parent, { studentID, subject }, { pubsub }) => {
      // console.log(studentID)
      return pubsub.subscribe(`GRADE ${studentID + subject}`);
    },
  },
  hw: {
    subscribe: (parent, { studentID }, { pubsub }) => {
      return pubsub.subscribe("HW");
    },
  },
  message: {
    subscribe: (parent, { to, courseID }, { db, pubsub }) => {
      return pubsub.subscribe(`chatBox ${to} in class ${courseID}`);
    },
  },
  chatbox: {
    subscribe: (parent, { courseID }, { pubsub }) => {
      return pubsub.subscribe(`new chatbox in class ${courseID}`);
    },
  },
  chatboxChange: {
    subscribe: (parent, { name, courseID }, { pubsub }) => {
      return pubsub.subscribe(`chatBox ${name + courseID}`);
    },
  },
};
export default Subscription;
