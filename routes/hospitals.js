const { Router } = require('express');
const { check } = require('express-validator');
const { jwtValidation } = require('../middlewares/jwtValidation');
const { fieldsValidation } = require('../middlewares/fieldsValidation');
const { getHospitals, createHospital, updateHospital, deleteHospital } = require('../controllers/hospitals');

const router = Router();

router.get('/', jwtValidation, getHospitals);
router.post('/', [
  jwtValidation,
  check('name', `'Name' is a mandatory field.`).not().isEmpty(),
  fieldsValidation
], createHospital);
router.put('/:id', [
  jwtValidation,
  check('name', `'Name' is a mandatory field.`).not().isEmpty(),
  fieldsValidation
], updateHospital);
router.delete('/:id', jwtValidation, deleteHospital);

module.exports = router;
