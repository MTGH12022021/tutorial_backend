wrapedSendMail = require("../config/mail/mail.config")

const sendMail = async (toMail) => {
    var mailOptions = {
        from: "loicho01672778853@gmail.com",
        to: toMail,
        subject: "Forgot Password",
        text: (Math.floor(Math.random() * (99999 - 10000))).toString()
    };
    let resp = await wrapedSendMail(mailOptions);
    // log or process resp;
    console.log(resp);
    return resp;
};

module.exports = sendMail;