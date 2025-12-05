const Joi = require("joi");
const mongoose = require("mongoose");
const dayjs = require("dayjs");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(timezone);

const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

const timezoneValidator = (value, helpers) => {
  try {
    dayjs().tz(value);
    return value;
  } catch (e) {
    return helpers.error("any.invalid");
  }
};

const createEventSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),

  startTimeUTC: Joi.date().iso().required(),

  endTimeUTC: Joi.date().iso().required(),

  initialTimezone: Joi.string().custom(timezoneValidator).required(),

  assignedProfiles: Joi.array()
    .items(Joi.string().custom(objectId))
    .min(1)
    .required(),
});

const updateEventSchema = Joi.object({
  updatedBy: Joi.string().custom(objectId).required(),

  title: Joi.string().min(1).max(200),

  startTimeUTC: Joi.date().iso(),

  endTimeUTC: Joi.date().iso(),

  initialTimezone: Joi.string().min(1), 

  assignedProfiles: Joi.array().items(Joi.string().custom(objectId)),
}).min(2);

const eventIdSchema = Joi.object({
  id: Joi.string().custom(objectId).required(),
});

module.exports = { createEventSchema, updateEventSchema, eventIdSchema };
