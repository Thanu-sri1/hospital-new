const notificationService = require("../services/notificationService");

const sendNotification = async (req, res, next) => {
  try {
    const notification = await notificationService.sendNotification(req.body);
    res.status(201).json(notification);
  } catch (error) {
    next(error);
  }
};

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await notificationService.getNotifications();
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendNotification,
  getNotifications
};
