const Notification = require("../models/Notification");

const createNotification = (user, type, title, message, post = null) =>
  Notification.create({ user, type, title, message, post });

module.exports = { createNotification };
