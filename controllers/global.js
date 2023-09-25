const { response } = require('express');
const User = require('../models/user');
const Hospital = require('../models/hospital');
const Doctor = require('../models/doctor');

//***************************************************************************
//                               Search in all collections
//***************************************************************************
const search = async (req, res = response) => {

  const search = req.params.search;
  const regexp = new RegExp(search, 'i');

  const [ users, hospitals, doctors ] = await Promise.all([
    User.find({ name: regexp }),
    Hospital.find({ name: regexp }),
    Doctor.find({ name: regexp })
  ]);

  res.json({
    status: 200,
    users,
    hospitals,
    doctors
  });

};

//***************************************************************************
//                               Search in a collection
//***************************************************************************
const searchByCollection = async (req, res = response) => {
  
  const collection = req.params.name;
  const query = req.params.query;
  const regexp = new RegExp(query, 'i');
  let data = [];

  switch (collection) {
    case 'users':
      data = await User.find({ name: regexp });
      break;

    case 'hospitals':
      data = await Hospital.find({ name: regexp })
                           .populate('createdBy', 'name');
      break;

    case 'doctors':
      data = await Doctor.find({ name: regexp })
                         .populate('createdBy', 'name')
                         .populate('hospital', 'name');
      break;

    default:
      res.status(400).json({
        status: 400,
        message: 'Collection not found.'
      });
      break;
  }

  res.json({
    status: 200,
    data
  });

};

module.exports = { search, searchByCollection };
