const mongoose = require("mongoose")
const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const path = require("path")
const { userProtected } = require("./middleware/userProtected")
require("dotenv").config({ path: "./.env" })


// db coonection

mongoose.connect(process.env.MONGO_URL)

const app = express()

// image access by-frontend

app.use(express.static("post"))
app.use(express.static(path.join(__dirname, "dist")))

// middlewares
app.use(express.json())
app.use(cors(
    {
        origin: "https://banaonodejssubmission.onrender.com",
        credentials: true
    }
))
app.use(cookieParser())

app.use("/api", require("./routes/authRoute"))
app.use("/api/blog", userProtected, require("./routes/blogRouts"))

app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message || "Internal server errro" })
})

app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"))
})

mongoose.connection.once("open", () => {
    console.log("Mongoose connected")
    app.listen(process.env.PORT, () => {
        console.log("Server running")
    })
})