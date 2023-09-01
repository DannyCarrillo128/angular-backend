const { Router } = require('express');
const fileUpload = require('express-fileupload');
const { jwtValidation } = require('../middlewares/jwtValidation');
const { uploadImage, getImage } = require('../controllers/uploads');

const router = Router();

router.use(fileUpload());
router.put('/:collection/:id', jwtValidation, uploadImage);
router.get('/:collection/:image', jwtValidation, getImage);

module.exports = router;
