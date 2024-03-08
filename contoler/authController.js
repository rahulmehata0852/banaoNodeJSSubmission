const asyncHandler = require("express-async-handler")
const validator = require("validator")
const Auth = require("../model/Auth")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { sendEmail } = require("../utils/sendEmail")


exports.registerUser = asyncHandler(async (req, res) => {

    const { email, name, password } = req.body

    if (validator.isEmpty(name)) {
        return res.status(400).json({ message: "Email invalid" })
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Email invalid" })
    }
    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ message: "PLZ enter  Strong  poassword" })
    }




    const result = await Auth.findOne({ email })
    if (result) {
        return res.status(400).json({ message: "Email Already register with us" })
    }

    const hashPass = await bcrypt.hash(password, 10)
    await Auth.create({ name, email, password: hashPass })
    res.status(201).json({ message: "Register success" })
})




exports.LogInUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email" })
    }

    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ message: "Invalid password" })
    }

    const result = await Auth.findOne({ email })

    if (!result) {
        return res.status(400).json({ message: "Email not found plz register" })
    }

    const comparePass = await bcrypt.compare(password, result.password)

    if (!comparePass) {
        return res.status(400).json({ message: "Wrong Password" })
    }

    const token = jwt.sign({ id: result._id }, process.env.JWT_KEY, { expiresIn: "7d" })

    res.cookie("auth", token, { maxAge: 60 * 60 * 60 * 24 * 2 })

    res.status(200).json({ message: "Log In success", result: { name: result.name, email: result.email, role: result.role } })

})

exports.logOut = asyncHandler(async (req, res) => {
    res.clearCookie("auth")
    res.status(200).json({ message: "Log Out Success" })
})


// forgot password

exports.forgotPassword = asyncHandler(async (req, res) => {

    const { email } = req.body
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Enter valid email" })
    }

    const result = await Auth.findOne({ email })

    if (!result) {
        return res.status(400).json({ message: "Email not register with us" })
    }
    const OTP = Math.floor(100000 + Math.random() * 900000);
    await Auth.findByIdAndUpdate(result._id, { otp: OTP })
    const resolve = await sendEmail({ to: email, subject: "One Time Password (OTP)", text: `Your one time Password id ${OTP}` })
    if (resolve) {
        return res.status(200).json({ message: "Check you email and Enter OTP" })
    }

    res.status(400).json({ message: "Unable to send email" })
})


exports.verifyoTPAndChangePassword = asyncHandler(async (req, res) => {
    const { otp, email, newPassword } = req.body

    if (validator.isEmpty(otp)) {
        return res.status(400).json({ message: "Enter valid otp" })
    }
    if (!validator.isStrongPassword(newPassword)) {
        return res.status(400).json({ message: "Enter Strong Password" })
    }
    if (otp.length < 6 || otp.length > 6) {
        return res.status(400).json({ message: "Enter valid otp" })
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Enter valid email" })
    }

    const result = await Auth.findOne({ email })

    if (!result) {
        return res.status(400).json({ message: "Email not register with us" })
    }

    if (result.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" })
    }

    const hashPass = await bcrypt.hash(newPassword, 10)


    await Auth.findByIdAndUpdate(result._id, { otp: "", password: hashPass })
    res.status(200).json({ message: "Password change success" })
})





