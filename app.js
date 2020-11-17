const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
let posts=[];

app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost:27017/daydablogDB", {
  useNewUrlParser: true
});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

const aboutContent = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const contactContent = "ZYXWVUTSRQPONMLKJIHGFEDCBA";

app.get("/", function(req, res) {
  Post.find({}, function(err, posts) {
    res.render("index", { posts: posts});
  });
});

app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });

});

app.get("/posts/:postId", function(req, res) {
  const requestedTitle = _.lowerCase(req.params.postName);
  const requestedPostId = req.params.postId;

  Post.findOne({
    _id: requestedPostId
  }, function(err, post) {
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});


app.listen(3000,function(){
  console.log("Server started on port 3000");
});
