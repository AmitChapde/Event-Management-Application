const {
  createEventService,
  getEventsByProfileIdService,
  getEventByIdService,
  getAllEvents,
  updateEventService,
  getEventLogsService,
} = require("../services/eventService");

const createEventController = async (req, res) => {
  try {
    const event = await createEventService(req.body);
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllEventsController = async (req, res) => {
  try {
    const events = await getAllEvents();

    return res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve events.",
    });
  }
};

const getEventsByProfileIdController = async (req, res) => {
  try {
    const events = await getEventsByProfileIdService(req.params.profileId);
    res.status(200).json(events);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching events", error: err.message });
  }
};

const getEventByIdController = async (req, res) => {
  try {
    const event = await getEventByIdService(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found." });
    res.status(200).json(event);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching event", error: err.message });
  }
};

const updateEventController = async (req, res) => {
  try {
    const updated = await updateEventService(
      req.params.id,
      req.body,
      req.body.updatedBy
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getEventLogsController = async (req, res) => {
  try {
    const logs = await getEventLogsService(req.params.id);
    res.status(200).json(logs);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching logs", error: err.message });
  }
};

module.exports = {
  createEventController,
  getEventsByProfileIdController,
  getEventByIdController,
  getAllEventsController,
  updateEventController,
  getEventLogsController,
};
