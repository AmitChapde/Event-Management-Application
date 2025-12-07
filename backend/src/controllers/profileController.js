const {
  createProfile,
  getAllProfiles,
  getProfileById,
  updateProfile,
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

const updateProfileController = async (req, res) => {
  try {
    const profileId = req.params.id;
    const { name } = req.body;


    const updatedProfile = await updateProfile(profileId,name);

    if (!updateProfile) {
      return res.status(404).json({ message: "Profile not Found" });
    }

    res.status(200).json({
      message: "Profile Updated",
      timezone: updatedProfile,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error Updating Profile", error: error.message });
  }
};

module.exports = {
  createProfileController,
  getAllProfilesController,
  getProfileByIdController,
  updateProfileController,
};
