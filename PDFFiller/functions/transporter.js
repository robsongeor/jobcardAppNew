
const { google } = require("googleapis");
const functions = require("firebase-functions");




const SENDER_EMAIL = "liftrucksservice@gmail.com";


const REFRESH_TOKEN = functions.config().gmail.refresh_token;

console.log("Gmail creds:",
    { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN, SENDER_EMAIL });


const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI,
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// async function sendMail() {
//   const accessToken = await oAuth2Client.getAccessToken();

//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       type: "OAuth2",
//       user: SENDER_EMAIL,
//       clientId: CLIENT_ID,
//       clientSecret: CLIENT_SECRET,
//       refreshToken: REFRESH_TOKEN,
//       accessToken: accessToken.token,
//     },
//   });

//   const mailOptions = {
//     from: SENDER_EMAIL,
//     to: "liftrucksservice@gmail.com",
//     subject: "Test Gmail OAuth2",
//     text: "It works!",
//   };

//   const result = await transporter.sendMail(mailOptions);
//   console.log("Mail sent:", result);
// }

// sendMail().catch(console.error);
