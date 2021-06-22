import mongoose from 'mongoose';
import AppError from '../error/AppError.js';

const ObjectId = mongoose.Types.ObjectId;

export const checkId = (id) => {
  if (!ObjectId.isValid(id))
    throw new AppError(400, `${id} is not an ObjectId`);
};
