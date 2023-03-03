require('dotenv').config();
const nodemailer = require('nodemailer');

const USERNAME = process.env.EMAIL_USERNAME;
const PASSWORD = process.env.EMAIL_PASSWORD;

const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: USERNAME,
        pass: PASSWORD,
    },
    secure: false,
});

/**
 * Sends email by sending the options
 *
 * @param {object} options Options to configure email sending
 * @param {string} options.to The email address that will receive the email
 * @param {string} options.subject The subject for the email
 * @param {string} options.html HTML message that will be contained in the email
 */
const send = ({ to, subject, html }) =>
    transport.sendMail({
        from: USERNAME,
        to,
        subject,
        html,
    });

module.exports = {
    send,
};
