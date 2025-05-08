const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,   // 🔥 you can add required true to username also (recommended)
  },
  email: {
    type: String,
    required: true,
    unique: true,     // 🔥 optional, to avoid duplicate emails
  },
  password: {
    type: String,
    required: true,
  },
  list: [
    {
      type: mongoose.Types.ObjectId,
      ref: "List",
    }
  ],
});

module.exports = mongoose.model("User", userSchema);
