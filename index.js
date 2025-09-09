const fs = require("fs-extra");
const login = require("ws3-fca");
const path = require("path");

const config = require("./config.json");

// Command collection
const commands = new Map();
const commandPath = path.join(__dirname, "commands");

// Load all command files
fs.readdirSync(commandPath).forEach(file => {
  if (file.endsWith(".js")) {
    const command = require(path.join(commandPath, file));
    commands.set(command.name, command);
  }
});

login({ appState: require("./appstate.json") }, (err, api) => {
  if (err) return console.error(err);

  api.setOptions({ listenEvents: true, selfListen: false });
  console.log("✅ Bot is now running...");

  api.listenMqtt(async (err, event) => {
    if (err) return console.error(err);

    // Message event
    if (event.type === "message" && event.body) {
      const prefix = config.prefix;
      const body = event.body.trim();

      if (!body.startsWith(prefix)) return;

      const args = body.slice(prefix.length).split(" ");
      const cmd = args.shift().toLowerCase();

      if (commands.has(cmd)) {
        try {
          await commands.get(cmd).run({ api, event, args, config });
        } catch (e) {
          console.error(e);
          api.sendMessage("❌ Error running command.", event.threadID, event.messageID);
        }
      }
    }

    // Title change lock
    if (event.logMessageType === "log:thread-name") {
      const lockedName = config.gclock[event.threadID];
      if (lockedName) {
        api.setTitle(lockedName, event.threadID);
      }
    }

    // Nickname change lock
    if (event.logMessageType === "log:user-nickname") {
      const lockedNick = config.nicklock[event.threadID];
      if (lockedNick) {
        api.changeNickname(lockedNick, event.threadID, event.author);
      }
    }
  });
});
