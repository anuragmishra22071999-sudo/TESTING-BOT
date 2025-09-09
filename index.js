const login = require("ws3-fca"); // apna FCA bhi rakh sakte ho
const { loadCommands } = require("./handler/commandHandler");
const { loadEvents } = require("./handler/eventHandler");
const config = require("./config.json");
const appState = require("./appstate.json");

const commands = loadCommands(__dirname + "/commands");
const events = loadEvents(__dirname + "/events");

login({ appState }, (err, api) => {
  if (err) return console.error(err);

  api.setOptions({ listenEvents: true, selfListen: false });
  console.log("🤖 Messenger Bot Started!");

  // 🔹 Thread-specific data (nickname lock, gclock, etc.)
  let threadData = {};

  api.listenMqtt(async (err, event) => {
    if (err) return console.error(err);

    // ===== COMMAND HANDLER =====
    if (event.type === "message" && event.body && event.body.startsWith(config.prefix)) {
      const args = event.body.slice(config.prefix.length).trim().split(/ +/);
      const cmdName = args.shift().toLowerCase();

      if (commands.has(cmdName)) {
        try {
          await commands.get(cmdName).run({ api, event, args, threadData });
        } catch (e) {
          console.error(e);
          api.sendMessage("❌ Error executing command.", event.threadID);
        }
      }
    }

    // ===== EVENT HANDLER =====
    if (events.has(event.type)) {
      try {
        await events.get(event.type).run({ api, event, threadData });
      } catch (e) {
        console.error(e);
      }
    }
  });
});
