const nodemailer = require("nodemailer")
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config({ path: "./.env" });



exports.sendEmail = (emailOptions) => new Promise((resolve, reject) => {
    try {
        const { to = process.env.FROM_EMAIL, subject = "One Time Password (OTP)", text = "Your OTP is 123456" } = emailOptions
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.FROM_EMAIL,
                pass: process.env.EMAIL_PASS
            }
        })

        transporter.sendMail({ to, from: process.env.FROM_EMAIL, subject: subject, text: text }, (error) => {
            if (error) {
                console.log(error)
                return reject(error.message)
            }
            resolve("Email Send Success")

        })


    } catch (error) {
        reject(error.message)
    }
})

