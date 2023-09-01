const path = require('path');
const fs = require('fs');
const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { updateImage } = require('../helpers/updateImage');

const uploadImage = (req, res = response) => {

  const { collection, id } = req.params;
  const validCollections = ['users', 'hospitals', 'doctors'];

  if (!validCollections.includes(collection)) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid collection.'
    });
  }

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      status: 400,
      message: 'No files were uploaded.'
    });
  }

  const image = req.files.image;
  const fileName = image.name.split('.');
  const extension = fileName[fileName.length - 1];
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

  if (!validExtensions.includes(extension)) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid image extension. Valid extensions: JPG, JPEG, PNG, GIF.'
    });
  }

  const newFileName = `${ uuidv4() }.${ extension }`;
  const path = `./uploads/${ collection }/${ newFileName }`;

  image.mv(path, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        status: 500,
        message: 'Error saving the image.'
      });
    }

    updateImage(collection, id, newFileName);

    res.json({
      status: 200,
      message: 'Image uploaded.',
      name: newFileName
    });
  });

};

const getImage = (req, res = response) => {

  const { collection, image } = req.params;

  const imagePath = path.join(__dirname, `../uploads/${ collection }/${ image }`);

  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    const noImagePath = path.join(__dirname, `../uploads/no_image.jpg`);
    res.sendFile(noImagePath)
  }

};

module.exports = { uploadImage, getImage };
