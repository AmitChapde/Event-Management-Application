const {
  createProfile,
  getAllProfiles,
  getProfileById,
  updateProfileTimezone,
} = require("../services/profileService");

const createProfileController = async (req, res) => {
  try {
    const { name } = req.body;
    const newProfile = await createProfile(name);

    res.status(201).json(newProfile);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Profile name already exists." });
    }

    res
      .status(500)
      .json({ message: "Error creating Profile", error: error.message });
  }
};

const getAllProfilesController = async (req, res) => {
  try {
    const profiles = await getAllProfiles();
    res.status(200).json(profiles);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting Profiles", error: error.message });
  }
};

const getProfileByIdController = async (req, res) => {
  try {
    const profile = await getProfileById(req.params.id);

    if (!profile) {
      return res.status(404).json({ message: "Profile not Found" });
    }
    res.status(200).json(profile);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting Profile", error: error.message });
  }
};

const updateProfileTimezoneController = async (req, res) => {
  try {
    const { newTimezone } = req.body;
    const profileId = req.params.id;

    if (!newTimezone) {
      return res.status(400).json({ message: "Timezone is not valid" });
    }

    const profile = await updateProfileTimezone(profileId, newTimezone);

    if (!profile) {
      return res.status(404).json({ message: "Profile not Found" });
    }

    res.status(200).json({
      message: "Timezone Updated",
      timezone: profile.timezone,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error Updating Timezone", error: error.message });
  }
};

module.exports = {
  createProfileController,
  getAllProfilesController,
  getProfileByIdController,
  updateProfileTimezoneController,
};
