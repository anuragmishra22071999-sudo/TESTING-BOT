module.exports = {
  name: "reload",
  run: async ({ api, event, config }) => {
    if (event.senderID !== config.owner) return api.sendMessage("❌ Only owner can reload.", event.threadID);
    api.sendMessage("♻️ Reload karne ke liye bot restart karo.", event.threadID);
    process.exit(1);
  }
};
