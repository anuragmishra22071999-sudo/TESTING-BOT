const fs = require("fs");
const path = require("path");

function loadCommands(dir) {
  let commands = new Map();
  const files = fs.readdirSync(dir).filter(file => file.endsWith(".js"));

  for (const file of files) {
    const command = require(path.join(dir, file));
    if (command.config && command.run) {
      commands.set(command.config.name, command);
      console.log(`✅ Loaded command: ${command.config.name}`);
    }
  }

  return commands;
}

module.exports = { loadCommands };
