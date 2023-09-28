const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');

//***************************************************************************
//                               Get users
//***************************************************************************
const getUsers = async (req, res) => {

  const start = Number(req.query.start) || 0;

  const [users, total] = await Promise.all([
    User.find({}, 'name email role google profilePicture')
        .skip(start)
        .limit(5),
    User.countDocuments()
  ]);

  res.json({
    status: 200,
    users,
    total
  });

};

//***************************************************************************
//                               Create user
//***************************************************************************
const createUser = async (req, res = response) => {

  const { email, password } = req.body;

  try {
    const searchEmail = await User.findOne({ email });
    if (searchEmail) {
      return res.status(400).json({
        status: 400,
        message: 'Email already in use.'
      });
    }

    const user = new User(req.body);

    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    const token = await generateJWT(user.id);

    res.json({
      status: 200,
      message: 'User created.',
      user,
      token
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
//                               Update user
//***************************************************************************
const updateUser = async (req, res = response) => {
  
  try {
    const id = req.params.id;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        status: 400,
        message: 'User not found.'
      });
    }

    const { password, google, email, ...data } = req.body;

    if (user.email !== email) {
      const existingEmail = await User.findOne({ email });
      
      if (existingEmail) {
        return res.status(400).json({
          status: 400,
          message: 'Email already in use.'
        });
      } else {
        if (!user.google) {
          data.email = email;
        } else if (user.email !== email) {
          return res.status(400).json({
            status: 400,
            message: 'Google users are unable to change its email.'
          });
        }
      }
    }    
    
    const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });

    res.json({
      status: 200,
      user: updatedUser
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
//                               Delete user
//***************************************************************************
const deleteUser = async (req, res = response) => {

  try {
    const id = req.params.id;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        status: 400,
        message: 'User not found.'
      });
    }

    await User.findByIdAndDelete(id);

    res.json({
      status: 200,
      message: 'User deleted.'
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: 'Unexpected error.'
    });
  }

};

module.exports = { getUsers, createUser, updateUser, deleteUser };
