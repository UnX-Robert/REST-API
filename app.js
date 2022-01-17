const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('views engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb+srv://username:password@cluster0.ixg4u.mongodb.net/wikiDB?retryWrites=true&w=majority", function(err) {
  if (err) {
    console.log(err);
  }
})

const articleSchema = {
  title: String,
  content: String
}

const Article = new mongoose.model("article", articleSchema);

const defaultArticles = [
  {
    "title": "CRUD",
    "content": "(Create, Read, Update, Delete) is an acronym for ways one can operate on stored data. It is a mnemonic for the four basic functions of persistent storage.",
    "__v": 0
  },
  {
    "title": "REST",
    "content": "REST is short for Representational State Transfer. It's an architectural style for designing APIs.",
    "__v": 0
  },
  {
    "title": "Bootstrap",
    "content": "This is a framework developed by Twitter that contains pre-made front-end templates for web design",
    "__v": 0
  },
  {
    "title": "DOM",
    "content": "The Document Object Model is like an API for interacting with our HTML",
    "__v": 0
  },
  {
    "title": "API",
    "content": "API stands for Application Programming Interface. It is a set of subroutine definitions, communication protocols, and tools for building software. In general terms, it is a set of clearly defined methods of communication among various components. A good API makes it easier to develop a computer program by providing all the building blocks, which are then put together by the programmer.",
    "__v": 0
  }
]

app.get('/', function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.get('/insert', function(req, res) {
  Article.insertMany(defaultArticles, function(err) {
    if (!err) {
      res.redirect('/articles');
    }
    else {
      res.send(err);
    }
  })
})

// Request targeting all articles
app.route("/articles")
  .get(function(req, res) {
    Article.find({}, function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      }
      else {
        res.send(err);
      }
    });
  })
  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    newArticle.save(function(err) {
      if(!err) {
        res.send("Successfully added new article.")
      }
      else {
        res.send(err);
      }
    });
  })
  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("Successfully deleted all the articles.");
      }
      else {
        res.send(err);
      }
    });
});

// Request targeting a specific article
app.route("/articles/:articleTitle")
  .get(function(req, res) {
    Article.findOne({title: req.params.articleTitle}, function(err, articleFound) {
      if (articleFound) {
        res.send(articleFound);
      }
      else {
        res.send("No articles matching that title was found.");
      }
    })
  })
  .put(function(req, res) {
    Article.updateOne(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      function(err) {
        if (!err) {
          res.send("Successfully updated the article!");
        }
        else {
          res.send(err);
        }
      });
  })
  .patch(function(req, res) {
    Article.updateOne(
      {title: req.params.articleTitle},
      {$set: req.body},
      function(err) {
        if (!err) {
          res.send("Successfully updated the article!");
        }
        else {
          res.send(err);
        }
      });
  })
  .delete(function(req, res) {
    Article.deleteOne(
      {title: req.params.articleTitle},
      function(err) {
        if (!err) {
          res.send("Article was deleted successfully!")
        }
        else {
          res.send(err);
        }
      }
    );
  });

app.listen(process.env.PORT, function() {
  console.log("Server running on port 3000");
})
