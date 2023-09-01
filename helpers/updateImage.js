const fs = require('fs');
const User = require('../models/user');
const Hospital = require('../models/hospital');
const Doctor = require('../models/doctor');

const deleteImage = (path) => {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
};

const updateImage = async (collection, id, fileName) => {
  
  let oldPath = '';

  switch (collection) {
    case 'users':
      const user = await User.findById(id);

      if (!user) {
        console.log(`User doesn't exist.`);
        return false;
      }

      oldPath = `./uploads/users/${ user.profilePicture }`;
      deleteImage(oldPath);

      user.profilePicture = fileName;
      await user.save();

      return true;

      break;
    
    case 'hospitals':
      const hospital = await Hospital.findById(id);

      if (!hospital) {
        console.log(`Hospital doesn't exist.`);
        return false;
      }

      oldPath = `./uploads/hospitals/${ hospital.image }`;
      deleteImage(oldPath);

      hospital.image = fileName;
      await hospital.save();

      return true;

      break;
    
    case 'doctors':
      const doctor = await Doctor.findById(id);

      if (!doctor) {
        console.log(`Doctor doesn't exist.`);
        return false;
      }

      oldPath = `./uploads/doctors/${ doctor.image }`;
      deleteImage(oldPath);

      doctor.image = fileName;
      await doctor.save();

      return true;

      break;
  }

};

module.exports = { updateImage };
