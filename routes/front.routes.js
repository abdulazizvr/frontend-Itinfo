const { Router } = require("express");

const router = Router();
const Topic = require("../models/Topic");
const Author = require("../models/Author");
const Dictionary = require("../models/Dictionary")
const Synonym = require("../models/Synonym")
const Description = require("../models/Description")
const Category = require("../models/Category")
const Tag = require("../models/Tag")
const { createViewPath } = require("../helpers/create_view_path");

router.get("/", (req, res) => {
  res.render(createViewPath("index"), {
    title: "Main Page",
    isHome: true,
  });
});

router.get("/dictionary", async (req, res) => {
  const dictionary = await Dictionary.find().lean();
  res.render(createViewPath("dictionary"), {
    title: "Dictionary",
    page_name: "dictionary",
    dictionary,
  });
});

router.get("/dictionary/:id",async(req,res) =>{
  const dictionary = await Dictionary.findOne({_id: req.params.id})
  const synonym = await Synonym.findOne({dict_id: dictionary.id})
  const description = await Description.findOne({_id:synonym.desc_id})
  const category = await Category.findOne({_id:description.category_id})
  const tag = await Tag.findOne({category_id:category.id})
  const topic = await Topic.findOne({_id:tag.topic_id})
  const author = await Author.findOne({_id:topic.author_id})
  let resp = {
    term:dictionary.term,
    description:description.description,
    category_name:category.category_name,
    title:topic.topic_title,
    text:topic.topic_text,
    first_name:author.author_first_name,
    last_name:author.author_last_name,
    id:author._id
  }
  res.render(createViewPath("oneDictionary"), {
    title: "Dictionary",
    page_name: "dictionary",
    resp
  });
})

router.get("/topics", async (req, res) => {
  const topics = await Topic.find().lean();
  res.render(createViewPath("topic"), {
    title: "Articles",
    page_name: "topic",
    topics,
  });
});

router.get("/authors", async (req, res) => {
  const authors = await Author.find().lean();
  res.render(createViewPath("author"), {
    title: "Authors",
    page_name: "author",
    authors,
  });
});
router.get("/authorstopic/:id",async (req,res) => {
  const author = await Author.findById(req.params.id)
  const otherArticles = await Topic.findOne({author_id:req.params.id})
  let resp = {
    name:author.author_first_name,
    lastname:author.author_last_name,
    title:otherArticles.topic_title,
    text:otherArticles.topic_text,
    author_id:otherArticles.author_id
  }
  res.render(createViewPath("otherarticles"), {
    title: "Articles",
    page_name: "article",
    resp,
  });
})

router.get("/adminpanelmain",async (req,res) => {
  res.render(createViewPath("adminpanelmain"),{
    title:"AdminPanel",
    page_name:"adminpanel",
  })
})
router.get("/adminpanelsignup",async (req,res) => {
  res.render(createViewPath("adminpanelsignup"),{
    title:"Sign up",
    page_name:"admin sign up",
  })
})
router.get("/adminpanelsignin",async (req,res) => {
  res.render(createViewPath("adminpanelsignin"),{
    title:"Sign in",
    page_name:"admin sign in",
  })
})
module.exports = router;
