import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const actionSchema = new Schema({
  _id: {
    type: String,
    required: [true, '_id is missing'],
  },
  personId: {
    type: String,
    required: [true, 'personId is missing'],
  },
  date: {
    type: Date,
    required: [true, 'date is missing'],
  },
  action: {
    type: String,
    required: [true, 'action is missing'],
  },
  notes: {
    type: String,
    required: [true, 'notes is missing'],
  },
}, { versionKey: false });

let Action = mongoose.model('Action', actionSchema);

export default Action;
