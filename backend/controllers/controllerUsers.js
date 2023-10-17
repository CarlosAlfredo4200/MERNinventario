const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generatorJWT = require("../helpers/generatorJWT");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register users
const registerUser = asyncHandler(async (req, res) => {
  try {
    const body = req.body;

    const { email } = body;

    //Check if user email already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      const error = new Error("Email has already been registered");
      return res.status(400).json({ msg: error.message });
    }

    //Create new user
    const user = new User(req.body);
    const token = generatorJWT(user._id);
    user.token = token;
    const userStored = await user.save();
    res.status(200).json({ msg: "User successfully registered" });
  } catch (error) {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("User not found, please signup");
    return res.status(404).json({ msg: error.message });
  }

  // User exists, check if password is correct
  if (await user.comprobarPassword(password)) {
    res.cookie("token", user.token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
      sameSite: "none",
      secure: true,
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: user.token,
    });
  } else {
    const error = new Error("The password is incorrect");
    res.cookie("token", "", {
      path: "/",
      httpOnly: true,
      expires: new Date(0),
      sameSite: "none",
      secure: true,
    });
    return res.status(404).json({ msg: error.message });
  }
});

//Logout User
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "Successfully Logged Out" });
});

// //Get User Data
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { _id, name, email, photo, phone, description } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      description,
    });
  } else {
    res.status(400);
    throw new Error("User Not Found");
  }
});

//Get Login Status
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }

  //Verify Token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.json(true);
  }
  return res.json(false);
});

//Update User
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
     
    const { name, email, photo, phone, description } = user;
    user.email = email;
    user.name = req.body.name || name;
    user.phone = req.body.phone || phone;
    user.description = req.body.description || description;
    user.photo = req.body.photo || photo;
    
    
      const updateUser = await user.save();
      res.status(200).json(updateUser);
    
  } else {
    error = new Error("User not found");
    return res.status(404).json({ msg: error.message });
  }
});

//Change a Password
// const changePassword = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id);

//   const { oldPassword, password } = req.body;

//   //Validate
//   if (!user) {
//     res.status(400);
//     throw new Error("User no found, please signup");
//   }

//   //Validate
//   if (!oldPassword || !password) {
//     res.status(400);
//     throw new Error("Please add old and new password");
//   }

//   //Check if old password is matches password in DB
//   const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

//   //Save new password
//   if (user && passwordIsCorrect) {
//     user.password = password;
//     await user.save();
//     res.status(200).send("Password change successful");
//   } else {
//     res.status(400);
//     throw new Error("Old Password is Incorrect");
//   }
// });

// const forgotPassword = asyncHandler(async (req, res) => {
//   const { email } = req.body;
//   const user = await User.findOne({ email });

//   if (!user) {
//     res.status(404);
//     throw new Error("User does not exist");
//   }

//   //Delete token if it exists in database
//   let token = await Token.findOne({ userId: user._id });
//   if (token) {
//     await token.deleteOne();
//   }

//   //Create Reset Token
//   let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
//   console.log(resetToken);

//   //Hash token before saving to database
//   const hashedToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");

//   //Save token to database
//   await new Token({
//     userId: user._id,
//     token: hashedToken,
//     createdAt: Date.now(),
//     expiresAt: Date.now() + 30 * (60 * 1000), // thirty minutes
//   }).save();

//   //Construct Reset Url
//   const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

//   // Reset Email
//   const message = `
//           <h2>Hello ${user.name}</h2>
//           <p>Please use the url below to reset your password</p>
//           <p>This reset link is valid for only 30 Minutes.</p>

//           <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

//           <p>Regards...</p>
//           <p>Pinvent Team</p>
//       `;

//   const subject = "Password Reset Request";
//   const send_to = user.email;
//   const sent_from = process.env.EMAIL_USER;

//   try {
//     await sendEmail(subject, message, send_to, sent_from);
//     res.status(200).json({ success: true, message: "Reset Email Sent" });
//   } catch (error) {
//     res.status(500);
//     throw new Error("Email not sent, please try again");
//   }
// });

// //Reset Password
// const resetPassword = asyncHandler(async (req, res) => {
//   const { password } = req.body;
//   const { resetToken } = req.params;

//   //Hash token, then compare to Token in database
//   const hashedToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");

//   //Find Token in database
//   const userToken = await Token.findOne({
//     token: hashedToken,
//     expiresAt: { $gt: Date.now() },
//   });

//   if (!userToken) {
//     res.status(404);
//     throw new Error("Invalid or Expired Token");
//   }

//   // Find user
//   const user = await User.findOne({ _id: userToken.userId });
//   user.password = password;
//   await user.save();
//   res.status(200).json({
//     message: "Password Reset Successful, Please Login",
//   });
// });

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  loginStatus,
  updateUser,
  //   AutenticarUser,
  //   MostrarUsers,
  //   BuscarUser,
  //   ActualizarUser,
  //   EliminarUser
};
