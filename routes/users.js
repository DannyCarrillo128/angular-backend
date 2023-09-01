const { Router } = require('express');
const { check } = require('express-validator');
const { jwtValidation } = require('../middlewares/jwtValidation');
const { fieldsValidation } = require('../middlewares/fieldsValidation');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/users');

const router = Router();

router.get('/', jwtValidation, getUsers);
router.post('/', [
  check('name', `'Name' is a mandatory field.`).not().isEmpty(),
  check('email', `'Email' is a mandatory field.`).isEmail(),
  check('password', `'Password' is a mandatory field.`).not().isEmpty(),
  fieldsValidation
], createUser);
router.put('/:id', [
  jwtValidation,
  check('name', `'Name' is a mandatory field.`).not().isEmpty(),
  check('email', `'Email' is a mandatory field.`).isEmail(),
  fieldsValidation
], updateUser);
router.delete('/:id', jwtValidation, deleteUser);

module.exports = router;
