const Event = require("../models/Event");
const EventLog = require("../models/EventLog");

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

const createLog = async (eventRef, updatedBy, changes) => {
  try {
    const log = new EventLog({
      eventRef,
      updatedBy,
      changes,
      updateTimestampUTC: new Date(),
    });
    await log.save();
  } catch (err) {
    console.error("Log creation failed:", err);
  }
};

const createEventService = async (data) => {
  const { title, startTimeUTC, endTimeUTC, initialTimezone, assignedProfiles } =
    data;

  const start = dayjs.utc(startTimeUTC);
  const end = dayjs.utc(endTimeUTC);

  if (!start.isValid() || !end.isValid()) {
    throw new Error("Invalid date/time format");
  }

  if (!dayjs().tz(initialTimezone).isValid()) {
    throw new Error("Invalid timezone identifier");
  }

  if (end.isSame(start) || end.isBefore(start)) {
    throw new Error("End time must be after start time");
  }

  const newEvent = new Event({
    title,
    startTimeUTC: start.toDate(),
    endTimeUTC: end.toDate(),
    initialTimezone,
    assignedProfiles,
  });

  await newEvent.save();
  return newEvent;
};

const getEventsByProfileIdService = async (profileId) => {
  return await Event.find({ assignedProfiles: profileId }).populate(
    "assignedProfiles",
    "name timezone"
  );
};

const getEventByIdService = async (eventId) => {
  return await Event.findById(eventId).populate(
    "assignedProfiles",
    "name timezone"
  );
};

const getAllEvents = async () => {
  try {
    const events = await Event.find({}).populate(
      "assignedProfiles",
      "name displayTimezone"
    );

    return events;
  } catch (error) {
    console.error("Error in eventService.getAllEvents:", error);
    throw new Error("Failed to retrieve all events.");
  }
};

const updateEventService = async (eventId, data) => {
  const { updatedBy } = data;

  if (!updatedBy) {
    throw new Error("updatedBy is required.");
  }

  const currentEvent = await Event.findById(eventId).lean();
  if (!currentEvent) throw new Error("Event not found");

  const assignedIds = currentEvent.assignedProfiles.map(id => id.toString());
  if (!assignedIds.includes(updatedBy)) {
    throw new Error("You are not authorized to update this event.");
  }

 
  const updateFields = {};

  if (data.title !== undefined) updateFields.title = data.title;

  if (data.startTimeUTC !== undefined) {
    const newStart = dayjs.utc(data.startTimeUTC);
    if (!newStart.isValid()) throw new Error("Invalid startTimeUTC");
    updateFields.startTimeUTC = newStart.toDate();
  }

  if (data.endTimeUTC !== undefined) {
    const newEnd = dayjs.utc(data.endTimeUTC);
    if (!newEnd.isValid()) throw new Error("Invalid endTimeUTC");
    updateFields.endTimeUTC = newEnd.toDate();
  }

  
  if (data.assignedProfiles !== undefined) {
    updateFields.assignedProfiles = data.assignedProfiles;
  }


  const changes = [];

  for (const key of Object.keys(updateFields)) {
    const oldValue = currentEvent[key];
    const newValue = updateFields[key];

    if (key === "assignedProfiles") {
      const oldIds = oldValue.map(id => id.toString()).sort();
      const newIds = newValue.map(id => id.toString()).sort();

      if (oldIds.join(",") !== newIds.join(",")) {
        changes.push({
          fieldName: key,
          oldValue: oldIds,
          newValue: newIds,
        });
      }
      continue;
    }

    if (String(oldValue) !== String(newValue)) {
      changes.push({
        fieldName: key,
        oldValue,
        newValue,
      });
    }
  }

 
  const updatedEvent = await Event.findByIdAndUpdate(
    eventId,
    { $set: updateFields },
    { new: true }
  );

 
  if (changes.length > 0) {
    await createLog(eventId, updatedBy, changes);
  }

  return updatedEvent;
};

const getEventLogsService = async (eventId) => {
  return await EventLog.find({ eventRef: eventId })
    .sort({ updateTimestampUTC: -1 })
    .populate("updatedBy", "name");
};

module.exports = {
  createEventService,
  getEventsByProfileIdService,
  getEventByIdService,
  getAllEvents,
  updateEventService,
  getEventLogsService,
};
