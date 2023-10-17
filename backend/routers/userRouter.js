const express = require("express");
const router = express.Router();

const {
  validatorRegisterlUser,
  validatorLoginlUser,
} = require("../middleware/middlewareValidatorUser");

const {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  loginStatus,
  updateUser
} = require("../controllers/controllerUsers");

const protect = require('../middleware/authMiddleware')
const { errorMonitor } = require("nodemailer/lib/xoauth2");

router.post("/register", validatorRegisterlUser, registerUser);
router.post("/login", validatorLoginlUser, loginUser);
router.get("/logout", logoutUser);
router.get("/getuser", protect, getUser);
router.get("/loggedin", loginStatus);
router.put("/updateuser", protect, updateUser);
 

module.exports = router;
