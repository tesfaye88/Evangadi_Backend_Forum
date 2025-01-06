require("dotenv").config()
const express = require("express")
const dbConnection = require("./db/dbConfig");
const app = express()
const port = 4000
const cors = require("cors")

app.use(cors())
// db connection
const userRoutes = require("./routes/userRoute");
const answerRoute = require("./routes/answerRoute");
 const questionRouter = require("./routes/questionRoute");

// Json middleware to extract Json data
app.use(express.json())


// user routes middleware
app.use("/api/user",userRoutes)



// questions routes middleware 
app.use("/api", questionRouter);



// answers routes middleware
app.use("/api", answerRoute);






// create tables 


app.get("/user",async (req, res) => {
  const createUserTable = `
    CREATE TABLE IF NOT EXISTS User(
      user_id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL,
      firstname VARCHAR(50) NOT NULL,
      lastname VARCHAR(50) NOT NULL,
      email VARCHAR(255) NOT NULL,
      online DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      password VARCHAR(100) NOT NULL
    )`;

  const questionTable = `
    CREATE TABLE IF NOT EXISTS Questions(
        id INT AUTO_INCREMENT PRIMARY KEY,
        question_id VARCHAR(200) NOT NULL UNIQUE,
        title VARCHAR(100) NOT NULL,
        description VARCHAR(255) NOT NULL,
        tag VARCHAR(255),
        created_at TIMESTAMP default CURRENT_TIMESTAMP,
        user_id INT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES User(user_id) ON DELETE CASCADE
);
`;

  const answerTable = `
    CREATE TABLE IF NOT EXISTS Answers(
        answer_id INT AUTO_INCREMENT PRIMARY KEY,
        answer VARCHAR(255) NOT NULL,
        user_id INT NOT NULL,
        question_id VARCHAR(200) NOT NULL,
        created_at TIMESTAMP default CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES User(user_id) ON DELETE CASCADE,
        FOREIGN KEY(question_id) REFERENCES Questions(question_id) ON DELETE CASCADE
    )`;

  try {
    await dbConnection.query(createUserTable);
    await dbConnection.query(questionTable);
    await dbConnection.query(answerTable);
    res.send("Tables created successfully");
  } catch (err) {
    console.error("Error creating tables:", err);
    res.status(500).send("Error creating tables");
  }
});



async function start() {
    try {
      const result = await dbConnection.execute("select 'test'");
        app.listen(port)
        console.log("database connection established");
        console.log(`listening on ${port}`);

    } catch (error) {
      console.log(error.message);
    }
}
start()



