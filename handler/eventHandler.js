const fs = require("fs");
const path = require("path");

function loadEvents(dir) {
  let events = new Map();
  const files = fs.readdirSync(dir).filter(file => file.endsWith(".js"));

  for (const file of files) {
    const event = require(path.join(dir, file));
    if (event.config && event.run) {
      events.set(event.config.eventType, event);
      console.log(`✅ Loaded event: ${event.config.eventType}`);
    }
  }

  return events;
}

module.exports = { loadEvents };
