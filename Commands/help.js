module.exports.config = {
  name: "help",
  description: "Shows all available commands",
  usage: "/help"
};

module.exports.run = async ({ api, event, args, commands }) => {
  let msg = "📜 Available Commands:\n\n";

  for (const [name, cmd] of commands) {
    msg += `👉 ${config.prefix}${name}`;
    if (cmd.config.description) msg += ` - ${cmd.config.description}`;
    if (cmd.config.usage) msg += `\n   ⤷ Usage: ${cmd.config.usage}`;
    msg += "\n\n";
  }

  api.sendMessage(msg.trim(), event.threadID, event.messageID);
};￼Enter
