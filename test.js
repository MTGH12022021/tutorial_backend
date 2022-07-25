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


sendmail = async () => {
    var mailOptions = {
        from: "loicho01672778853@gmail.com",
        to: "loicho01672778853@gmail.com",
        subject: "Checkkkkkkkkkkkkkk",
        text: (Math.floor(Math.random() * (99999 - 10000))).toString()
    };
    let resp = await wrapedSendMail(mailOptions);
    // log or process resp;
    return resp;
};

sendmail();



