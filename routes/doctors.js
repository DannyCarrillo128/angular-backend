const { Router } = require('express');
const { check } = require('express-validator');
const { jwtValidation } = require('../middlewares/jwtValidation');
const { fieldsValidation } = require('../middlewares/fieldsValidation');
const { getDoctors, createDoctor, updateDoctor, deleteDoctor } = require('../controllers/doctors');

const router = Router();

router.get('/', jwtValidation, getDoctors);
router.post('/', [
  jwtValidation,
  check('name', `'Name' is a mandatory field.`).not().isEmpty(),
  check('hospital', `'Hospital' must be a valid ID.`).isMongoId(),
  fieldsValidation
], createDoctor);
router.put('/:id', [
  jwtValidation,
  check('name', `'Name' is a mandatory field.`).not().isEmpty(),
  check('hospital', `'Hospital' must be a valid ID.`).isMongoId(),
  fieldsValidation
], updateDoctor);
router.delete('/:id', jwtValidation, deleteDoctor);

module.exports = router;
