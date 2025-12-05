const express = require("express");
const router = express.Router();
const validate=require('../middleware/validate');
const {
  createEventSchema,
  updateEventSchema,
  eventIdSchema,
} = require("../validations/event.validation");

const {
  createEventController,
  getAllEventsController,
  getEventByIdController,
  updateEventController,
  getEventsByProfileIdController,
  getEventLogsController,
} = require("../controllers/eventController");

router.post("/", validate(createEventSchema), createEventController);

router.get("/", getAllEventsController);

router.get("/:id", validate(eventIdSchema), getEventByIdController);

router.get("/profile/:profileId/events", getEventsByProfileIdController);

router.put("/:id", validate(updateEventSchema), updateEventController);

router.get("/:id/logs", validate(eventIdSchema), getEventLogsController);

module.exports = router;
