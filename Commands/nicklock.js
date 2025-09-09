module.exports = {
  name: "nicklock",
  run: async ({ api, event, args, config }) => {
    if (args[0] === "off") {
      delete config.nicklock[event.threadID];
      api.sendMessage("🔓 Nickname unlock ho gaya!", event.threadID);
    } else {
      const newNick = args.join(" ");
      config.nicklock[event.threadID] = newNick;

      // Set sabhi members ke nickname
      const threadInfo = await api.getThreadInfo(event.threadID);
      threadInfo.participantIDs.forEach(uid => {
        api.changeNickname(newNick, event.threadID, uid);
      });

      api.sendMessage("🔒 Nickname lock ho gaya: " + newNick, event.threadID);
    }
    require("fs-extra").writeFileSync("./config.json", JSON.stringify(config, null, 2));
  }
};￼Enter
