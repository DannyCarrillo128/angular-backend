const jwt = require('jsonwebtoken');

const generateJWT = (id) => {

  return new Promise((resolve, reject) => {
    const payload = { id };
    jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '12h' }, (err, token) => {
      if (err) {
        console.log(err);
        reject('Error generating JWT');
      } else {
        resolve(token);
      }
    });
  });

};

module.exports = { generateJWT };
