const express = require("express");
const router = express.Router();

const {
  createEventController,
  getAllEventsController,
  getEventByIdController,
  updateEventController,
  getEventsByProfileIdController,
  getEventLogsController
} = require("../controllers/eventController");

router.post("/", createEventController);

router.get("/", getAllEventsController);

router.get("/:id", getEventByIdController);

router.get("/profile/:profileId/events", getEventsByProfileIdController);

router.put("/:id", updateEventController);

router.get("/:id/logs", getEventLogsController);

module.exports = router;
