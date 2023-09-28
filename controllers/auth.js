const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');
const { verify } = require('../helpers/verifyGoogleToken');
const { getSidebarMenu } = require('../helpers/sidebar-menu');

//***************************************************************************
//                               Sign in
//***************************************************************************
const login = async (req, res = response) => {

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'Wrong email or password. Please try again.'
      });
    }

    const validatePassword = bcrypt.compareSync(password, user.password);
    if (!validatePassword) {
      return res.status(404).json({
        status: 404,
        message: 'Wrong email or password. Please try again.'
      });
    }

    const token = await generateJWT(user.id);

    const menu = getSidebarMenu(user.role);

    res.json({
      status: 200,
      token,
      menu
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: 'Unexpected error.'
    });
  }

};

//***************************************************************************
//                               Google sign in
//***************************************************************************
const googleSignIn = async (req, res = response) => {

  try {
    const { name, email, picture } = await verify(req.body.token);

    const existingUser = await User.findOne({ email });
    let user;

    if (!existingUser) {
      user = new User({
        name,
        email,
        password: '***',
        profilePicture: picture,
        google: true
      });
    } else {
      user = existingUser;
      user.google = true;
    }

    await user.save();

    const token = await generateJWT(user.id);

    const menu = getSidebarMenu(existingUser.role);

    res.json({
      status: 200,
      token,
      menu
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 400,
      message: 'Invalid token.'
    });
  }

};

//***************************************************************************
//                               Renew user token
//***************************************************************************
const renewToken = async (req, res = response) => {

  const id = req.id;
  
  const token = await generateJWT(id);

  const user = await User.findById(id);

  const menu = getSidebarMenu(user.role);

  res.json({
    status: 200,
    token,
    user,
    menu
  });

};

module.exports = { login, googleSignIn, renewToken };
