// Utility functions for sending emails
import {transporter} from '../config/email'



module.exports.sendEmail = function sendEmail(to:any, subject:any, text:any) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
};