import nodemailer from 'nodemailer';

export const emailConfig = {
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(emailConfig);

export const sendMail = async ({ from, html, subject, text, to }) => {
  const data = {
    from: from ?? process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  };


  await transporter.sendMail(data)

};

export default transporter;
