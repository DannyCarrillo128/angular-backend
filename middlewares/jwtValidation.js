const jwt = require('jsonwebtoken');

const jwtValidation = (req, res, next) => {
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      status: 401,
      message: 'Token not found.'
    });
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_KEY);
    
    req.id = id;

    next();
  } catch (error) {
    return res.status(401).json({
      status: 401,
      message: 'Invalid token.'
    });
  }
};

module.exports = { jwtValidation };
