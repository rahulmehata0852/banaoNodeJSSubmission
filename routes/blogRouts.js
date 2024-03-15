const { getBlog, addBlog, updateBlog, deleteBlog, getUserBlogComment, addUserBlogComment } = require("../contoler/blogController")
const router = require("express").Router()

router
    .get("/get-blog", getBlog)
    .post("/add-blog", addBlog)
    .put("/update-blog/:id", updateBlog)
    .delete("/delete-blog/:id", deleteBlog)

    .get("/get-user-comment", getUserBlogComment)
    .post("/add-user-comment", addUserBlogComment)

module.exports = router

