import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const allowedMinAge = 12;
const allowedMaxAge = 120;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    index: true,
    required: [true, 'username is missing'],
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'password is missing'],
    minlength: [4, 'password has to less characters'],
    maxlength: [20, 'password has to many characters'],
  },

  firstname: { type: String },
  lastname: { type: String, required: [true, 'lastname is missing'] },
  state: {
    type: String,
    enum: ['online', 'offline'],
    required: [true, 'state is missing'],
  },
  age: {
    type: Number,
    min: [allowedMinAge, `Age is below the allowed min of ${allowedMinAge}`],
    max: [allowedMaxAge, `Age is above the allowed max of ${allowedMaxAge}`],
    required: [true, 'age is missing'],
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: [true, 'gender is missing'],
  },
});

let User = mongoose.model('User', userSchema);

export default User;
