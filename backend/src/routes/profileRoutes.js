const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");
const {
  createProfileSchema,
  updateProfileTimezoneSchema,
  profileIdSchema,
} = require("../validations/profile.validation");

const {
  createProfileController,
  getAllProfilesController,
  getProfileByIdController,
  updateProfileTimezoneController,
} = require("../controllers/profileController");

router.post("/", validate(createProfileSchema), createProfileController);

router.get("/", getAllProfilesController);

router.get("/:id", validate(profileIdSchema), getProfileByIdController);

router.put(
  "/:id/",
  validate(profileIdSchema),
  validate(updateProfileTimezoneSchema),
  updateProfileTimezoneController
);

module.exports = router;
