const { Router } = require('express');
const { jwtValidation } = require('../middlewares/jwtValidation');
const { search, searchByCollection } = require('../controllers/global');

const router = Router();

router.get('/:search', jwtValidation, search);
router.get('/collection/:name/:query', jwtValidation, searchByCollection);

module.exports = router;
