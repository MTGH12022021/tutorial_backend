const nodemailer = require("nodemailer");

async function wrapedSendMail(mailOptions) {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "loicho0167277@gmail.com",
                pass: "iwnfibyihuuuxklj"
            }
        });

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("error is " + error);
                resolve(false); // or use rejcet(false) but then you will have to handle errors
            }
            else {
                console.log('Email sent: ' + info.response);
                resolve(mailOptions.text);
            }
        })

    })
}

module.exports = wrapedSendMail