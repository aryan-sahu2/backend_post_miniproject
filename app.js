const express = require("express");
const app = express();
const path = require("path");
const userModel = require("./models/user");
const postModel = require("./models/post");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const upload = require("./config/multerconfig");

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("index");
});
app.get("/createuser", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/profile", isLoggedIn, async (req, res) => {
  //   console.log(req.user);
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("posts");
  // console.log(user);
  res.render("profile", { user });
});

app.get("/profile/upload", isLoggedIn, async (req, res) => {
  res.render("profileupload");
});

app.post("/upload", isLoggedIn, upload.single("image"), async (req, res) => {
//   console.log(req.user);
  const user = await userModel.findOne({ _id: req.user.userid });
  const filename = req.file.filename;
  user.profilepic = filename;
  await user.save();
  res.redirect("/profile");
});

app.get("/like/:postid", isLoggedIn, async (req, res) => {
  let post = await postModel.findOne({ _id: req.params.postid });

  if (post.likes.indexOf(req.user.userid) === -1) {
    post.likes.push(req.user.userid);
  } else {
    post.likes.splice(post.likes.indexOf(req.user.userid), 1);
  }

  //   post.likes.pop(req.user.userid);
  await post.save();
  //   console.log("Liked user: ", post);

  res.redirect("/profile");
});

app.get("/edit/:postid", isLoggedIn, async (req, res) => {
  let user = await userModel.findOne({ _id: req.user.userid });
  let post = await postModel.findOne({ _id: req.params.postid });

  // console.log(post,user)
  res.render("edit", { post, user });
});

app.post("/update/:postid", isLoggedIn, async (req, res) => {
  let post = await postModel.findOneAndUpdate(
    { _id: req.params.postid },
    { content: req.body.content }
  );

  // console.log(post)
  res.redirect("/profile");
});

app.post("/post", isLoggedIn, async (req, res) => {
  let { content } = req.body;
  let user = await userModel.findOne({ email: req.user.email });
  let postContent = await postModel.create({ user: user._id, content });

  user.posts.push(postContent._id);
  await user.save();
  res.redirect("/profile");
});

app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/login");
});

app.post("/login", async (req, res) => {
  let { email, password } = req.body;

  let user = await userModel.findOne({ email });
  console.log(user);
  if (!user) return res.status(500).send("Something went wrong");

  bcrypt.compare(password, user.password, (err, result) => {
    if (err) console.log(err);
    else {
      if (result) {
        let token = jwt.sign({ email: email, userid: user._id }, "shhhh");
        res.cookie("token", token);
        res.status(200).redirect("/profile");
        // res.redirect('/profile')
      } else res.redirect("/login");
    }
  });
});

app.post("/register", async (req, res) => {
  let { username, name, age, email, password } = req.body;
  let user = await userModel.findOne({ email });
  if (user) return res.status(500).send("User already registered");
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      console.log(hash);
      let createdUser = await userModel.create({
        username,
        name,
        age,
        email,
        password: hash,
      });
      console.log(createdUser);
      let token = jwt.sign({ email: email, userid: createdUser._id }, "shhhh");
      res.cookie("token", token);
      res.send("registered");
    });
  });
  console.log(req.body);
});

function isLoggedIn(req, res, next) {
  if (req.cookies.token === "") res.redirect("/login");
  else {
    let data = jwt.verify(req.cookies.token, "shhhh");
    req.user = data;
  }
  next();
}

app.listen(3000, () => {
  console.log("Running on port 3000");
});
