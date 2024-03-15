const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")
const Blog = require("../model/Blog");
const fs = require("fs/promises");
const path = require("path");
const validator = require("validator")
const { uploadimage } = require("../utils/upload");
const Comment = require("../model/Comment");

exports.getBlog = asyncHandler(async (req, res) => {
    const { id } = req.body
    const result = await Blog.find({ userId: id });
    res.json({ message: "User blog Fetch Success", result });
})

exports.addBlog = asyncHandler(async (req, res) => {
    uploadimage(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        const { title, desc, comments, likes } = req.body;

        if (!title || !desc) {
            return res.status(400).json({ message: "Please provide all required information" });
        }
        jwt.verify(req.cookies.auth, process.env.JWT_KEY, async (err, decode) => {
            if (err) {
                console.error("JWT error:", err);
                return res.status(401).json({ message: "nahi hora" });
            }
            try {
                await Blog.create({ ...req.body, post: req.file.filename, userId: decode.id });
                res.status(201).json({ message: "Data added zala" });
            } catch (error) {
                console.error("Error adding blog post:", error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
    });
})

exports.updateBlog = asyncHandler(async (req, res) => {

    const { title } = req.body

    if (title) {
        const { id } = req.params
        await Blog.findByIdAndUpdate(id, req.body)
        return res.status(200).json({ message: "blog data updated successfully" });
    } else {
        uploadimage(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: err.message || "Sometig went wrong" })
            }
            const { id } = req.params
            const result = await Blog.findById(id)
            console.log(result);
            await fs.unlink(path.join(__dirname, "..", "post", result.post))
            const { title, desc, comments, likes } = req.body
            if (!title || !desc) {
                return res.status(400).json({ message: "Please provide all required information" });
            }
            await Blog.findByIdAndUpdate(id, { ...req.body, post: req.file.filename })
            return res.status(200).json({ message: "blog data updated successfully" });

        })
    }
})

exports.deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params


    const result = await Blog.findById(id)

    if (!result) {
        return res.status(400).json({ message: "Something went wrong" })
    }

    const comments = await Comment.find({ blogId: result._id })

    for (const item of comments) {
        await Comment.findByIdAndDelete(item._id)
    }


    await fs.unlink(path.join(__dirname, "..", "post", result.post))


    await Blog.findByIdAndDelete(id)
    res.status(200).json({ message: "blog Delete Sucess" })
})



exports.getUserBlogComment = asyncHandler(async (req, res) => {

    const { blogId } = req.query
    const { id } = req.body

    if (validator.isEmpty(id) || validator.isEmpty(blogId)) {
        return res.status(400).json({ message: "Blogid IS required" })
    }

    const result = await Comment.find({ userId: id, blogId })

    res.json({ message: "User comment fetch success", result })

})


exports.addUserBlogComment = asyncHandler(async (req, res) => {

    const { id, blogId, comment } = req.body

    if (validator.isEmpty(id) || validator.isEmpty(blogId) || validator.isEmpty(comment)) {
        return res.status(400).json({ message: "All fields are required" })
    }
    const result = await Comment.create({ userId: id, blogId, comment })
    res.json({ message: "User comment add success" })

})