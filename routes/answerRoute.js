const express = require("express");
const answerRoute = express.Router();
const middleware = require("../middleware/Auth");
const { deleteAnwer, editAnswer ,postAnswer, allAnswers} = require("../controller/useAnswer");


// Post Answers for a Question
// answerRoute.post("/answer", postAnswer);


//this is post request to send message change the routes name and function name as you want
answerRoute.post("/answers/:question_id",middleware, postAnswer);
// this is get request to get all answers from database


answerRoute.get("/answers/allAnswers", middleware,allAnswers);


// edit and delete routes
answerRoute.delete("/delete/:answer_id", middleware, deleteAnwer);
answerRoute.put("/edit/:answer_id", middleware, editAnswer);


module.exports = answerRoute;
