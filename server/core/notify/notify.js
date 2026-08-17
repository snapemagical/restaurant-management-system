const Notification = require("./notification.model");

async function notify(userId, message) {
  await Notification.create({ userId, message });

  if (process.env.SMTP_HOST) {
    // Email sending is intentionally left as a stub - wire up nodemailer here
    // if your project needs real email delivery. Not required for the demo.
  }
}

module.exports = { notify };
