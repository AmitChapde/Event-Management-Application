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
    timezone: Joi.string().min(1).required(),
  }),
};

const updateProfileTimezoneSchema = {
  params: Joi.object({
    id: Joi.string().custom(objectId).required(),
  }),

  body: Joi.object({
    newTimezone: Joi.string().required().label("Timezone"),
  }),
};

const profileIdSchema = {
  params: Joi.object({
    id: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createProfileSchema,
  updateProfileTimezoneSchema,
  profileIdSchema,
};
