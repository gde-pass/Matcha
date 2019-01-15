let nodemailer = require ('nodemailer');

function sendMail(email, token, path) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        port: 25,
        auth: {
            user: 'Matcha42matcha42matcha@gmail.com',
            pass: 'password123456!'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let mailOption = {
        form: "matcha",
        to: email,
        subject: 'activate your account',
        text: `Please click on this link to activate your account "http://localhost:8080/${path}/${token}"`
    };

    transporter.sendMail(mailOption, (error) => {
        if (error) {
            // console.log(error);
        }
    });
}
module.exports = sendMail;