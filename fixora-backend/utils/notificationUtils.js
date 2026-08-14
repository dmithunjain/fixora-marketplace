const Notification = require('../models/Notification');

const createNotification = async (userId, title, message, type = 'general') => {
  try {
    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

module.exports = { createNotification };
