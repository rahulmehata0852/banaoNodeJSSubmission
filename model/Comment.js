const mongoose = require("mongoose")
const commentSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Types.ObjectId,
        ref: "auth",
        required: true
    },

    blogId: {
        type: mongoose.Types.ObjectId,
        ref: "blog",
        required: true
    },
    comment: {
        type: String,
        required: true
    },



})

module.exports = mongoose.model("comment", commentSchema)
