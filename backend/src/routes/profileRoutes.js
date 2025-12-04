const express=require('express');
const router=express.Router();
const {
  createProfileController,
  getAllProfilesController,
  getProfileByIdController,
  updateProfileTimezoneController,
} =require('../controllers/profileController')



router.post('/',createProfileController)

router.get('/',getAllProfilesController)

router.get('/:id',getProfileByIdController);

router.put('/:id',updateProfileTimezoneController)



module.exports=router;