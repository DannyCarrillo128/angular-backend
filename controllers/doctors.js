const { response } = require('express');
const Doctor = require('../models/doctor');

//***************************************************************************
//                               Get doctors
//***************************************************************************
const getDoctors = async (req, res = response) => {

  const doctors = await Doctor.find()
                              .populate('createdBy', 'name, image')
                              .populate('updatedBy', 'name, image')
                              .populate('hospital', 'name image');
  
  res.json({
    status: 200,
    doctors
  });

};

//***************************************************************************
//                               Create doctor
//***************************************************************************
const createDoctor = async (req, res = response) => {

  try {
    const doctor = new Doctor({ createdBy: req.id, updatedBy: req.id, ...req.body });

    await doctor.save();

    res.json({
      status: 200,
      message: 'Doctor created.',
      doctor
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
//                               Update doctor
//***************************************************************************
const updateDoctor = async (req, res = response) => {

  try {
    const id = req.params.id;
    const uid = req.id;

    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({
        status: 404,
        message: `Doctor doesn't exists.`
      });
    }

    const data = { ...req.body, updatedBy: uid };

    const updatedDoctor = await Doctor.findByIdAndUpdate(id, data, { new: true });

    res.json({
      status: 200,
      doctor: updatedDoctor
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
//                               Delete doctor
//***************************************************************************
const deleteDoctor = async (req, res = response) => {

  try {
    const id = req.params.id;

    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({
        status: 404,
        message: `Doctor doesn't exists.`
      });
    }

    await Doctor.findByIdAndDelete(id);

    res.json({
      status: 200,
      message: 'Doctor deleted.'
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 500,
      message: 'Unexpected error.'
    });
  }

};

module.exports = { getDoctors, createDoctor, updateDoctor, deleteDoctor };
