import "dotenv/config";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const sendEmail = async (to, subject, html) => {
  await resend.emails.send({
    from: process.env.SENDER_EMAIL,
    to: to,
    subject: subject,
    html: html,
  });
};

export default sendEmail;
