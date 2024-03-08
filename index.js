const mongoose = require("mongoose")
const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
require("dotenv").config({ path: "./.env" })


// db coonection

mongoose.connect(process.env.MONGO_URL)

const app = express()

// middlewares
app.use(express.json())
app.use(cors())
app.use(cookieParser())

app.use("/api", require("./routes/authRoute"))

app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message || "Internal server errro" })
})

app.use("*", (req, res) => {
    res.status(404).json({ message: "No resource found" })
})

mongoose.connection.once("open", () => {
    console.log("Mongoose connected")
    app.listen(process.env.PORT, () => {
        console.log("Server running")
    })
})