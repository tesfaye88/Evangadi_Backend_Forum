const dbConnection = require("../db/dbConfig");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");


// post questions 
async function postQuestion(req, res) {
    const {title, description } = req.body;
    const {id,username} = req.user
    console.log(id);
    console.log(username);

    if (!title || !description) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "All fields are required" });
    }
    const questionid = uuidv4();
    try {

    await dbConnection.query(
        "INSERT INTO Questions (question_id, user_id, title, description) VALUES (?, ?, ?, ?)",
        [questionid,id, title, description]
    );
        
    return res.status(StatusCodes.CREATED).json({ message: "question posted successfully" });
    } catch (err) {
       console.log(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong, please try again later" + err });
    }
}


// get request function to get questions
async function getAllQuestions(req, res) {
  try {
    // Fetch all questions from the database
    const [questions] = await dbConnection.query(`
     SELECT 
        Questions.question_id , 
        Questions.title, 
        Questions.description,
        Questions.created_at,
        User.user_id,
        User.username 
        FROM Questions
        JOIN User ON Questions.user_id = User.user_id
        ORDER BY Questions.id DESC;

    `);

    // Check if there are no questions
    if ( questions.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: "No questions found.",
      });
    }
    // Success response
    return res.status(StatusCodes.OK).json({
      questions,
    });
    
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "something went wrong, please try again later"});
  }
}

// to get single question
async function getSingleQuestion(req, res) {
  const { question_id } = req.params;

   // Extract question_id from URL parameters
  const splitted_que_id = question_id.slice(1)
  try {
    // Fetch the specific question from the database
    const [question] = await dbConnection.query(
      `
      SELECT 
        Questions.question_id , 
        Questions.title, 
        Questions.description, 
        Questions.user_id , 
        Questions.created_at,
        User.username
      FROM Questions
      JOIN User ON Questions.user_id = User.user_id
      WHERE Questions.question_id = ? `,
      [splitted_que_id]
    );
    // console.log(question);
    // Check if the question exists
    if (!question || question.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: "The requested question could not be found.",
      });
    }

    // Success response
    return res.status(StatusCodes.OK).json({
      question: question[0], // Return the first result since question_id is unique
    });
  } catch (error) {
    console.error("Error fetching question:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

module.exports = { postQuestion, getAllQuestions, getSingleQuestion };

