import nodemailer from "nodemailer";
import ejs from "ejs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Setting up the transport for nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "alesterdavis115@gmail.com",
    pass: "fmwmeychranufyyo",
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const renderTemplate = async (templatePath, data) => {
  try {
    console.log(__dirname)
    const absolutePath = path.join(__dirname, "..", "template", templatePath);
    const template = fs.readFileSync(absolutePath, "utf8");
    return ejs.render(template, data);
  } catch (error) {
    console.error("Error rendering the template:", error);
    throw error;
  }
};

export const sendUserEmail = async (dynamicData) => {
  try {
    const emailHtml = await renderTemplate("email-template.ejs", dynamicData);
    const info = await transporter.sendMail({
      from: "alesterkvp@gmail.com",
      to: dynamicData.email,
      subject: dynamicData.sub,
      html: emailHtml,
    });

    console.log("Message sent: %s", info.messageId);
    return info.messageId;
  } catch (error) {
    console.error("Error sending email:", error);
  }
};


// export const sendAdminEmail = async (to, subject, dynamicData) => {
//   try {
//     const emailHtml = await renderTemplate("email-template.ejs", dynamicData);
//     const info = await transporter.sendMail({
//       from: "alesterkvp@gmail.com",
//       to: to,
//       subject: subject,
//       html: emailHtml,
//     });

//     console.log("Message sent: %s", info.messageId);
//   } catch (error) {
//     console.error("Error sending email:", error);
//   }
// };
