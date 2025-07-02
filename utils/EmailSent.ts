import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, html: string) {
    
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465, 
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // send email from user
  const info = await transporter.sendMail({
    from: `"MkaDevs" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log("Message sent: %s", info.messageId);
}
