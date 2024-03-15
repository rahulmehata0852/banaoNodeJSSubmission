const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")

exports.userProtected = asyncHandler(async (req, res, next) => {
    const token = req.cookies.auth
    if (!token) {
        return res.status(401).json({ message: "cookie not found" })
    }

    jwt.verify(token, process.env.JWT_KEY, async (err, decode) => {
        if (err) {
            return res.status(401).json({ message: err.message || "Unauthorized access" })
        }
        req.body.id = decode.id

        next()
    })

})
