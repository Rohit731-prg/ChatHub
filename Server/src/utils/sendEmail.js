import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: `"MyApp Verification" <${process.env.EMAIL}>`,
      to,
      subject,
      text,
      html: `<h1>This is form ChatHub</h1>
      <p>${text}</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.log("error from sendEmail", error);
  }
};
