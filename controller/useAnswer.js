const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../db/dbConfig");
// const { all } = require("../routes/answerRoute");
// const { default: Allanswer } = require("../../client/src/Components/Hooks/Allanswer");



// post request function to send answers 
const postAnswer = async (req, res)=>{
    const {id} = req.user
    const {question_id} = req.params
    const {answer} = req.body;

    if (!answer) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ 
                error: "Bad Request",
                message: "Please provide answer" });
    }
    
    try {
        await dbConnection.query(
            "insert into Answers (user_id, answer, question_id) values ( ?,?,?)",
            [id,answer, question_id]
        );
        return res
            .status(StatusCodes.CREATED)
            .json({
                 msg:"Thank for your answers!!",
                 message: "answer posted successfully" });
    } catch (err) {
        console.log(err);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ 
                error:"Internal Server Error",
                message: "An unexpected error occurred"
             });
    }
}


const allAnswers = async (req, res) => {
  // const {username}=req.user
  try {
    const fetchAllAnswers = `SELECT Questions.title,Questions.description,Answers.user_id,Answers.created_at,Answers.answer_id,Answers.question_id,User.username,Answers.answer from Answers JOIN User on User.user_id=Answers.user_id JOIN Questions on Answers.question_id=Questions.question_id `;
    const [allAnswers] = await dbConnection.query(fetchAllAnswers);
  
    res.status(StatusCodes.ACCEPTED).json({ allAnswers });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "internal server error" });
  }
};


// .....

// get request function to get answers

// ....

// make sure to do both functions



// delete answers

const deleteAnwer = async (req, res) => {
  // const{id}=req.user
  const { answer_id } = req.params;

  try {
    const deleteAnswer = `DELETE FROM Answers WHERE answer_id=?`;
    await dbConnection.query(deleteAnswer, [answer_id]);
    return res.status(StatusCodes.ACCEPTED).json({ msg: "answer deleted" });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "internal server error" });
  }
};


// edit answers

const editAnswer = async (req, res) => {
  const { answer_id } = req.params;
  const { answer } = req.body; // Retrieve updated answer from request body
  try {
    const editAnswerQuery = `UPDATE Answers SET answer = ? WHERE answer_id = ?`;
    await dbConnection.query(editAnswerQuery, [answer, answer_id]);
    return res.status(StatusCodes.ACCEPTED).json({ msg: "Answer edited" });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal server error" });
  }
};


module.exports={deleteAnwer,editAnswer,postAnswer,allAnswers}