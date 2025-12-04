const Profile = require("../models/Profile");

const createProfile = async (name) => {
  const newProfile = new Profile({ name });
  await newProfile.save();
  return newProfile;
};

const getAllProfiles = async () => {
  return Profile.find().select("_id name timezone");
};

const getProfileById = async (id) => {
  return Profile.findById(id).select("_id name timezone");
};

const updateProfileTimezone = async (id, newTimezone) => {
  return Profile.findByIdAndUpdate(
    id,
    { timezone: newTimezone },
    { new: true }
  );
};

module.exports = {
  createProfile,
  getAllProfiles,
  getProfileById,
  updateProfileTimezone,
};
