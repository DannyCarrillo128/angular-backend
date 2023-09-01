const { response } = require('express');
const { validationResult } = require('express-validator');

const fieldsValidation = (req, res = response, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 400,
      errors: errors.mapped()
    });
  }

  next();
};

module.exports = { fieldsValidation };
