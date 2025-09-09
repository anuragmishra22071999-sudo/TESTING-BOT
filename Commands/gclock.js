module.exports = {
  name: "gclock",
  run: async ({ api, event, args, config }) => {
    if (args[0] === "off") {
      delete config.gclock[event.threadID];
      api.sendMessage("🔓 Group name unlock ho gaya!", event.threadID);
    } else {
      const newName = args.join(" ");
      config.gclock[event.threadID] = newName;
      api.setTitle(newName, event.threadID);
      api.sendMessage("🔒 Group name lock ho gaya: " + newName, event.threadID);
    }
    require("fs-extra").writeFileSync("./config.json", JSON.stringify(config, null, 2));
  }
};
