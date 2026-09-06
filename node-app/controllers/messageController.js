const mongoose = require('mongoose');
const Message = require('../models/Message');

const Users = mongoose.models.Users || mongoose.model('Users', {
  username: String,
  password: String,
  contact: String,
  gmail: String,
  LikedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Products' }]
});

module.exports.sendMessage = (req, res) => {
  const { senderId, receiverId, productId, text } = req.body;
  const message = new Message({ senderId, receiverId, productId, text });

  message.save()
    .then((result) => res.send({ message: 'Message sent successfully.', data: result }))
    .catch(() => res.status(400).send({ message: 'Unable to send message.' }));
};

module.exports.getConversation = (req, res) => {
  const { userId, otherUserId } = req.body;

  Message.find({
    $or: [
      { senderId: userId, receiverId: otherUserId },
      { senderId: otherUserId, receiverId: userId }
    ]
  })
    .sort({ createdAt: 1 })
    .then((result) => res.send({ message: 'success', messages: result }))
    .catch(() => res.status(400).send({ message: 'Unable to load conversation.', messages: [] }));
};

module.exports.getUserConversations = (req, res) => {
  const userId = req.body.userId;

  Message.find({
    $or: [{ senderId: userId }, { receiverId: userId }]
  })
    .sort({ createdAt: -1 })
    .then(async (messages) => {
      const otherUserIds = [];
      const conversations = [];

      messages.forEach((message) => {
        const otherUserId = message.senderId.toString() === userId
          ? message.receiverId.toString()
          : message.senderId.toString();

        if (!otherUserIds.includes(otherUserId)) {
          otherUserIds.push(otherUserId);
          conversations.push({ otherUserId, lastMessage: message });
        }
      });

      const users = await Users.find({ _id: { $in: otherUserIds } });
      const result = conversations.map((conversation) => ({
        ...conversation,
        user: users.find((user) => user._id.toString() === conversation.otherUserId)
      }));

      res.send({ message: 'success', conversations: result });
    })
    .catch(() => res.status(400).send({ message: 'Unable to load conversations.', conversations: [] }));
};
