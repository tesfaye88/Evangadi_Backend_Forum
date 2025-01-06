const express = require("express");
const middleware = require("../middleware/Auth");
const questionRouter = express.Router();

// import controllers functions
const {
  postQuestion,
  getAllQuestions,
  getSingleQuestion,
} = require("../controller/useQuestion");

// Insert Question to the database
questionRouter.post("/question", middleware, postQuestion);

// Get all the questions from the database
questionRouter.get("/question", middleware, getAllQuestions);

// select a single question from the database
questionRouter.get(
  "/question/:question_id",
  middleware,
  getSingleQuestion
);



// questionRouter.get("/question/allquestions", middleware, allquestions);

module.exports = questionRouter;
