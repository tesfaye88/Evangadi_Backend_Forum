const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const bcyrpt = require("bcrypt");

// online status-check function
const onlineStatus = async (user_id) => {
  const onlineUser = `UPDATE User SET online=NOW() WHERE user_id=?`;
  await dbConnection.query(onlineUser, [user_id]);
};

// Registration controller
async function register(req, res) {
  const { username, first_name, last_name, email, password } = req.body;

  // check if All fields are filled
  if (!username || !first_name || !last_name || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide all required fields",
    });
  }

  // try to inserting to database
  try {
    const selectUser = `SELECT  username,user_id FROM User where username=?or email=? `;
    const [users] = await dbConnection.query(selectUser, [username, email]);

    // check if user already exists in the database
    if (users.length > 0) {
      return res.status(StatusCodes.CONFLICT).json({
        error: "Conflict",
        message: "User already existed",
      });
    }

    // validate password length
    if (password.length < 8) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Password must be at least 8 characters",
      });
    }

    // bcyrpt password
    // salt is a random string that is used to generate a hashed password. 10 is the number of rounds to hash the password. 10 is a good default.
    const salt = await bcyrpt.genSalt(10);
    const hashPassword = await bcyrpt.hash(password, salt);

    // insert user data to the database
    const insertData = `INSERT INTO User(username,firstname,lastname,email,password) VALUES (?,?,?,?,?)`;
    await dbConnection.query(insertData, [
      username,
      first_name,
      last_name,
      email,
      hashPassword,
    ]);
    res
      .status(StatusCodes.CREATED)
      .json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

// Login controller
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide all required fields",
    });
  }

  try {
    const selectemail =
      "SELECT username,password,user_id,firstname FROM User where email=?";
    const [useremail] = await dbConnection.query(selectemail, [email]);

    // check if user exists in the database
    if (useremail.length == 0) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid email" });
    }

    // check if the user exists and compare password with hashed password from the database
    const isMatched = await bcyrpt.compare(password, useremail[0].password);
    if (!isMatched) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid password" });
    }

    // update the online status after a successful login
    if (useremail.length > 0) {
      await onlineStatus(useremail[0].user_id);
    }

    // generate a jwt token with user details
    const username = useremail[0].username;
    const id = useremail[0].user_id;

    // create jwt token
    const token = jwt.sign({ username, id }, process.env.JWT_SECRET);
    return res.status(StatusCodes.ACCEPTED).json({
      message: "User login successful",
      token,
      username,
      id,
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

// auth controller
async function checkUser(req, res) {
  // this middleware will check if the user is authenticated before accessing the protected routes.
  // req.user contains the user information that was extracted from the token.
  //this comes from the middleware auth
  const { username, id } = req.user;
  res
    .status(StatusCodes.ACCEPTED)
    .json({ message: "valid user", username, id });
}



// check weather a user is online or offline
const isOnline = async (req, res) => {
  try {
    const selectOnlineUser = `
      SELECT user_id, 
      
             (CASE 
                WHEN TIMESTAMPDIFF(MINUTE, online, NOW()) <= 5 THEN 'online'
                ELSE 'offline'
              END) AS status
      FROM User`;
    const [users] = await dbConnection.query(selectOnlineUser);

    res.status(StatusCodes.OK).json({ users });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal server error. Try again later!" });
  }
};

// ALTER TABLE User ADD COLUMN online DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

module.exports = { register, login, checkUser,isOnline,onlineStatus};
