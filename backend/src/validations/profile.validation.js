const Joi = require("joi");
const mongoose = require("mongoose");

const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

const createProfileSchema = {
  body: Joi.object({
    name: Joi.string().min(1).max(100).required(),
  }),
};

const updateProfileSchema = {
  params: Joi.object({
    id: Joi.string().custom(objectId).required(),

  }),

  body: Joi.object({
    name: Joi.string().min(1).max(100).required(),
  }),
};

const profileIdSchema = {
  params: Joi.object({
    id: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createProfileSchema,
  updateProfileSchema,
  profileIdSchema,
};
