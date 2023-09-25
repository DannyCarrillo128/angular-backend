const { response } = require('express');
const Hospital = require('../models/hospital');

//***************************************************************************
//                               Get hospitals
//***************************************************************************
const getHospitals = async (req, res = response) => {

  const start = Number(req.query.start) || 0;

  const [hospitals, total] = await Promise.all([
    Hospital.find()
            .populate('createdBy', 'name profilePicture')
            .populate('updatedBy', 'name profilePicture')
            .skip(start)
            .limit(5),
    Hospital.countDocuments()
  ]);

  res.json({
    status: 200,
    hospitals,
    total
  });
  
};

//***************************************************************************
//                               Create hospital
//***************************************************************************
const createHospital = async (req, res = response) => {

  try {
    const id = req.id;
    const hospital = new Hospital({ createdBy: id, updatedBy: id, ...req.body });

    await hospital.save();

    res.json({
      status: 200,
      message: 'Hospital created.',
      hospital
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: 'Unexpected error.'
    });
  }

};

//***************************************************************************
//                               Update hospital
//***************************************************************************
const updateHospital = async (req, res = response) => {

  try {
    const id = req.params.id;
    const uid = req.id;

    const hospital = await Hospital.findById(id);

    if (!hospital) {
      return res.status(404).json({
        status: 404,
        message: `Hospital doesn't exists.`
      });
    }

    const data = { ...req.body, updatedBy: uid };

    const updatedHospital = await Hospital.findByIdAndUpdate(id, data, { new: true });

    res.json({
      status: 200,
      hospital: updatedHospital
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 500,
      message: 'Unexpected error.'
    });
  }

};

//***************************************************************************
//                               Delete hospital
//***************************************************************************
const deleteHospital = async (req, res = response) => {
  
  try {
    const id = req.params.id;

    const hospital = await Hospital.findById(id);

    if (!hospital) {
      return res.status(404).json({
        status: 404,
        message: `Hospital doesn't exists.`
      });
    }

    await Hospital.findByIdAndDelete(id);

    res.json({
      status: 200,
      message: 'Hospital deleted.'
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 500,
      message: 'Unexpected error.'
    });
  }

};

module.exports = { getHospitals, createHospital, updateHospital, deleteHospital };
