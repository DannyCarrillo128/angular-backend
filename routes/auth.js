const { Router } = require('express');
const { check } = require('express-validator');
const { fieldsValidation } = require('../middlewares/fieldsValidation');
const { jwtValidation } = require('../middlewares/jwtValidation');
const { login, googleSignIn, renewToken } = require('../controllers/auth');

const router = Router();

router.post('/', [
  check('email', `'Email' is a mandatory field.`).isEmail(),
  check('password', `'Password' is a mandatory field.`).not().isEmpty(),
  fieldsValidation
], login);

router.post('/google', [
  check('token', `'Token' is a mandatory field.`).not().isEmpty(),
  fieldsValidation
], googleSignIn);

router.get('/renewal', jwtValidation, renewToken);

module.exports = router;
