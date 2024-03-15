const { v4: uuid } = require("uuid")
const path = require("path")
const multer = require("multer")
const fs = require("fs")

const postStorage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, uuid() + path.extname(file.originalname))
    },
    destination: (req, file, cb) => cb(null, "post")
})
const uploadimage = multer({ storage: postStorage }).single("post")
module.exports = { uploadimage }