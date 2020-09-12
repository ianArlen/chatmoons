const mongoose = require("mongoose");
const schema = mongoose.Schema;

const chatroomSchema = schema({
  name: {
    type: String,
    required: "Name is required!",
  },
});

module.exports = mongoose.model("Chatroom", chatroomSchema);
