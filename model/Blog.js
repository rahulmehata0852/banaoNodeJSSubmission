const mongoose = require("mongoose")
const blogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "auth",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    post: {
        type: String
    },
    comments: {
        type: String,

    },
    likes: {
        type: Number,
        default: 0
    },
    desc: {
        type: String

    }
})
module.exports = mongoose.model("blog", blogSchema)

