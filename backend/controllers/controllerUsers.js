const asyncHandler = require('express-async-handler');
const User = require("../models/userModel");
const generatorId = require('../helpers/IdGenerator');
const generatorJWT = require('../helpers/generatorJWT');



const registerUser = asyncHandler(async (req, res) => {
  try {
    const body = req.body;

    const { email } = body;

    //Check if user email already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      const error = new Error('Email has already been registered');
      return res.status(400).json({ msg: error.message });

    }


    //Create new user

    const user = new User(req.body);

    const userStored = await user.save();

    //Generate Token
    const token = generatorJWT(user._id);


    // Send HTTP-only cookie
    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
      sameSite: 'none',
      secure: true,
    });

    res.status(200).json({ msg: 'User successfully registered' });
  } catch (error) {
    res.status(400);
    throw new Error('Invalid user data');

  }


});

module.exports = {
  registerUser,
  //   AutenticarUser,
  //   MostrarUsers,
  //   BuscarUser,
  //   ActualizarUser,
  //   EliminarUser
};
