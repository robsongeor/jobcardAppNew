// get-gmail-refresh-token.js
const { google } = require("googleapis");

const oAuth2Client = new google.auth.OAuth2(
  "430743004571-5hdr0vqspdrbsielopgu15jco6na80a2.apps.googleusercontent.com",
  "http://localhost:3000/oauth2callback",
);

const SCOPES = ["https://mail.google.com/"];

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
});

console.log("Authorize this app by visiting this url:", authUrl);

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question("Enter the code from that page here: ", (code) => {
  oAuth2Client.getToken(code, (err, token) => {
    if (err) return console.error("Error retrieving access token", err);
    console.log("Your token:", token);
    readline.close();
  });
});
