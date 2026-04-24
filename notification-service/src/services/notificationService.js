const Notification = require("../models/Notification");

const sendNotification = async (payload) => {
  const notification = await Notification.create(payload);

  console.log(
    `[Notification] ${notification.type} -> ${notification.recipient}: ${notification.message}`
  );

  return notification;
};

const getNotifications = async () =>
  Notification.find().sort({ createdAt: -1 }).limit(50);

module.exports = {
  sendNotification,
  getNotifications
};
