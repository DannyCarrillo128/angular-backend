const { response } = require('express');
const Doctor = require('../models/doctor');

//***************************************************************************
//                               Get doctors
//***************************************************************************
const getDoctors = async (req, res = response) => {

  const start = Number(req.query.start) || 0;

  const [doctors, total] = await Promise.all([
    Doctor.find()
          .populate('createdBy', 'name profilePicture')
          .populate('updatedBy', 'name profilePicture')
          .populate('hospital', 'name image')
          .skip(start)
          .limit(5),
    Doctor.countDocuments()
  ]);
  
  res.json({
    status: 200,
    doctors,
    total
  });

};

//***************************************************************************
//                               Get doctor
//***************************************************************************
const getDoctor = async (req, res = response) => {

  try {
    const { id } = req.params;
  
    const doctor = await Doctor.findById(id)
                               .populate('hospital', 'name image');
  
    res.json({
      status: 200,
      doctor
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({  // If a response without status is sent,
      status: 404,          // the error message doesn't appear.
      message: 'Doctor not found.'
    });
  }

}

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

module.exports = { getDoctors, getDoctor, createDoctor, updateDoctor, deleteDoctor };
