wrapedSendMail = require("../config/mail/mail.config")
require('dotenv').config({
    path: './src/.env'
})

const sendMail = async (toMail, text) => {
    var mailOptions = {
        from: process.env.MAIL_USERNAME,
        to: "loicho01672778853@gmail.com",
        subject: "Forgot Password",
        text: text
    };
    let resp = await wrapedSendMail(mailOptions);
    console.log(resp)
    // log or process resp;
    return resp;
};

module.exports = sendMail;