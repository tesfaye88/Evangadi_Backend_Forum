const express = require("express")
const router = express.Router()

// user controllers
const {register,login,checkUser, isOnline} = require("../controller/userController")
const  middleware=require('../middleware/Auth')

// register request
router.post("/register",register)

// login user
router.post("/login",login)

// check user
router.get("/checkUser",middleware,checkUser);

// check online user
router.get("/online_status", isOnline);

module.exports = router
