import "dotenv/config";
import { Resend } from "resend";
import { AppError } from "./appError.js";

let resendClient;

const getResendClient = () => {
  if (!process.env.RESEND_API_KEY) {
    throw new AppError("RESEND_API_KEY is required to send emails", 500);
  }

  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }

  return resendClient;
};

const sendEmail = async (to, subject, html) => {
  if (!process.env.SENDER_EMAIL) {
    throw new AppError("SENDER_EMAIL is required to send emails", 500);
  }

  if (!to || !subject || !html) {
    throw new AppError("Email to, subject and html are required", 500);
  }

  const resend = getResendClient();
  const { data, error } = await resend.emails.send({
    from: process.env.SENDER_EMAIL,
    to,
    subject,
    html,
  });

  if (error) {
    throw new AppError(error.message || "Email send failed", 500);
  }

  return data;
};

export default sendEmail;
