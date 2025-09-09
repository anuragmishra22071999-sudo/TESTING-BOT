module.exports.config = {
  name: "nameLock",
  eventType: "log:thread-name" // jab group ka naam change ho
};

module.exports.run = async ({ api, event, threadData }) => {
  if (threadData.gclock) {
    if (event.logMessageData.name !== threadData.gclock) {
      api.setTitle(threadData.gclock, event.threadID);
      api.sendMessage(`⚠️ Group name is locked to "${threadData.gclock}"!`, event.threadID);
    }
  }
};￼Enter
