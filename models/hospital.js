const { Schema, model } = require('mongoose');

const HospitalSchema = Schema({
  name: { type: String, required: true },
  image: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

HospitalSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model('Hospital', HospitalSchema);
