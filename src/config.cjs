const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  session_secret: process.env.CHAT_SESSION_SECRET,
  session_name: process.env.CHAT_SESSION_NAME,
  port: process.env.CHAT_PORT,
  node_env: process.env.CHAT_NODE_ENV,
};
