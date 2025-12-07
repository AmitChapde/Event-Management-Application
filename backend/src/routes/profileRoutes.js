const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");
const {
  createProfileSchema,
  updateProfileSchema,
  profileIdSchema,
} = require("../validations/profile.validation");

const {
  createProfileController,
  getAllProfilesController,
  getProfileByIdController,
  updateProfileController,
} = require("../controllers/profileController");

router.post("/", validate(createProfileSchema), createProfileController);

router.get("/", getAllProfilesController);

router.get("/:id", validate(profileIdSchema), getProfileByIdController);

router.put(
  "/:id",
  validate(profileIdSchema),
  validate(updateProfileSchema),
  updateProfileController
);

module.exports = router;
