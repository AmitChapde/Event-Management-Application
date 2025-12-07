const Profile = require("../models/Profile");

const createProfile = async (name) => {
  const newProfile = new Profile({ name });
  await newProfile.save();
  return newProfile;
};

const getAllProfiles = async () => {
  return Profile.find().select("_id name ");
};

const getProfileById = async (id) => {
  return Profile.findById(id).select("_id name ");
};

const updateProfile = async (id,name) => {
  return Profile.findByIdAndUpdate(
    id,
    { name },
    { new: true }
  );
};

module.exports = {
  createProfile,
  getAllProfiles,
  getProfileById,
  updateProfile,
  
};
