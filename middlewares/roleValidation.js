const User = require('../models/user');

const roleValidation = async (req, res, next) => {

  try {
    const id = req.id;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'User not found.'
      });
    }

    if (user.role !== 'ADMIN') {
      return res.status(403).json({
        status: 403,
        message: 'Forbidden operation.'
      });
    }

    next();
  } catch(error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: 'Unexpected error.'
    });
  }

};

const sameUserValidation = async (req, res, next) => {

  try {
    const id = req.id;
    const userToEdit = req.params.id;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'User not found.'
      });
    }

    if (user.role !== 'ADMIN' && user.id !== userToEdit) {
      return res.status(403).json({
        status: 403,
        message: 'Forbidden operation.'
      });
    }

    next();
  } catch(error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: 'Unexpected error.'
    });
  }

};

module.exports = { roleValidation, sameUserValidation };