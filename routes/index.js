const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { generateToken } = require("../tokenGenerator/tokenGenerator");
const upload = require("./multer");

// Mongoose connection
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/pixelpalette");

// Models
const signupModel = require("../models/signupModel");
const postModel = require("../models/postModel");
const cookieParser = require("cookie-parser");

/* GET Routes. */
router.get("/", async function (req, res, next) {
  const posts = await postModel.find().populate("user");
  res.render("index", { posts });
});
router.get("/home", async function (req, res) {
  const email = req.cookies.token ? JSON.parse(req.cookies.token) : null;
  const user = await signupModel.findOne({ email });
  const posts = await postModel.find().populate("user");
  res.render("home", { user, posts });
});
router.get("/explore", async function (req, res) {
  const email = req.cookies.token ? JSON.parse(req.cookies.token) : null;
  const user = await signupModel.findOne({ email });
  const posts = await postModel.find().populate("user");
  res.render("explore", { user, posts });
});
router.get("/profile", async function (req, res) {
  const email = req.cookies.token ? JSON.parse(req.cookies.token) : null;
  const user = await signupModel.findOne({ email }).populate("posts");
  if (user) {
    res.render("profile", { user });
  } else {
    res.redirect("/home");
  }
});
router.get("/edit-profile", async function (req, res) {
  const email = req.cookies.token ? JSON.parse(req.cookies.token) : null;
  const user = await signupModel.findOne({ email });
  const posts = await postModel.find().populate("user");
  res.render("editProfile", { user, posts });
});
router.get("/create-post", async function (req, res) {
  const email = req.cookies.token ? JSON.parse(req.cookies.token) : null;
  const user = await signupModel.findOne({ email });
  const posts = await postModel.find().populate("user");
  res.render("createPost", { user, posts });
});
router.get("/logout", async function (req, res) {
  res.clearCookie("token");
  res.redirect("/");
});

/* POST Routes. */
router.post("/signup", async function (req, res) {
  const { username, email, password } = req.body;

  const user = await signupModel.findOne({ email });

  if (user) {
    return res.redirect("/login");
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const newUser = await signupModel.create({
    username,
    email,
    password: hash,
  });
  res.cookie("token", JSON.stringify(email));
  res.redirect("/home");
});
router.post("/login", async function (req, res) {
  const { email, password } = req.body;

  const user = await signupModel.findOne({ email });
  if (!user) {
    return res.redirect("/");
  }

  bcrypt.compare(password, user.password, function (err, success) {
    if (err) {
      return res.send("Error in password comparison");
    }
    if (success) {
      res.cookie("token", JSON.stringify(email));
      return res.redirect("/home");
    }
    res.send("Incorrect password");
  });
});
router.post("/edit-profile", async function (req, res) {
  const userData = req.cookies.token ? JSON.parse(req.cookies.token) : null;
  const user = signupModel.findOne({ email: userData.email });

  const { username, email, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const newUser = await signupModel.create({
    username,
    email,
    password: hash,
  });
  res.cookie("token", email);
  res.redirect("/profile");
});
router.post("/create-post", upload.single("image"), async function (req, res) {
  const email = req.cookies.token ? JSON.parse(req.cookies.token) : null;
  const user = await signupModel.findOne({ email: email });

  const { title, description, tag, orientation } = req.body;

  const post = await postModel.create({
    title,
    description,
    tag,
    orientation,
    user: user._id,
    image: req.file.filename,
  });
  user.posts.push(post._id);
  await user.save();

  res.redirect("/profile");
});
router.post("/save", async function (req, res) {
  const email = req.cookies.token ? JSON.parse(req.cookies.token) : null;
  const user = await signupModel.findOne({ email });

  user.savedPosts.push(req.body.postId);
  await user.save();

  const previousPage = req.get("Referer") || "/";
  res.redirect(previousPage);
});
router.post("/report", async function (req, res) {
  const email = req.cookies.token ? JSON.parse(req.cookies.token) : null;
  const user = await signupModel.findOne({ email });

  const postId = req.body.postId;
  const post = await postModel.findOne({ _id: postId });
  post.reports += 1;
  await post.save();
  const previousPage = req.get("Referer") || "/";
  res.redirect(previousPage);
});
router.post("/like", async function (req, res) {
  const email = req.cookies.token ? JSON.parse(req.cookies.token) : null;
  const user = await signupModel.findOne({ email });

  const postId = req.body.postId;
  const post = await postModel.findOne({ _id: postId });
  post.likes += 1;
  await post.save();
  const previousPage = req.get("Referer") || "/";
  res.redirect(previousPage);
});

module.exports = router;
