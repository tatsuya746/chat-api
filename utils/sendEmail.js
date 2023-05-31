const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const sendMail = async (email, subject, link, username) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const mailOptions = {
      from: "noreply@gmail.com",
      to: email,
      subject: subject,
      html: `<html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <style>
          body {
            background-color: #f9f9f9;
          }
        </style>
      </head>
      <body>
      <div style="width:950px; height: 362px; background-color: #f9f9f9;">
        <table
          cellpadding="0"
          cellspacing="0"
          border="0"
          width="100%"
          style="max-width: 640px; margin: 20px auto"
        >
          <tr>
            <td align="center">
              <a href="https://discord-clone-tony-3004.vercel.app">
                <img
                  style="width: 138px; height: 40px"
                  src="https://ci3.googleusercontent.com/proxy/xbGGyYfNO7rOwB3cJ8GvQ_6GUpaWXoqPKpUmrMJDjD2gVRFyUARcwh0qhbWv92i3qb1zJj3c9PYNULP_B3wHWJY--pjeXQiAyt6s5ETJieJ41Gy3loYi3AINdO8gJTk=s0-d-e1-ft#https://cdn.discordapp.com/email_assets/592423b8aedd155170617c9ae736e6e7.png"
                  alt=""
                />
              </a>
            </td>
          </tr>
          <tr>
            <td>
              <table
                cellpadding="0"
                cellspacing="0"
                border="0"
                width="100%"
                style="
                  background-color: white;
                  padding: 50px;
                  font-family: Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;"
              >
                <tr style="margin-bottom: 20px;">
                  <td
                    style="
                      font-size: 20px;
                      line-height: 24px;
                      font-weight: 500;
                      letter-spacing: 0.27px;
                      padding-bottom: 20px;
                    "
                  >
                    Hey ${username},
                  </td>
                </tr>
                <tr>
                  <td
                    style="
                      font-size: 16px;
                      color: #737f8d;
                      line-height: 24px;
                      padding-bottom: 20px;
                    "
                  >
                    Your Discord password can be reset by clicking the button below.
                    If you did not request a new password, please ignore this email.
                  </td>
                </tr>
                <tr>
                  <td style="display: block; margin-top: 20px; text-align: center">
                    <a
                      style="
                        border: none;
                        border-radius: 3px;
                        color: white;
                        padding: 15px 19px;
                        background-color: rgb(88, 102, 242);
                        text-decoration: none;
                        line-height: 100%;
                        background: #5865f2;
                        color: white;
                        font-family: Ubuntu, Helvetica, Arial, sans-serif;
                        font-size: 15px;
                        font-weight: normal;
                        text-transform: none;
                        margin: 0px;
                        cursor: pointer;
                        display: inline-block;
                      "
                      href="${link}"
                      >Reset Password</a
                    >
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
      </body>
    </html>`,
    };
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendMail;
