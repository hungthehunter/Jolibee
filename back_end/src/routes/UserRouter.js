const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const {authMiddleware,authUserMiddleware} = require('../middleware/AuthMiddleware')
const uploadCloud = require('../middleware/uploaderMiddleware')

router.post('/sign-up',userController.createUser)
router.post('/create-user',uploadCloud.single('avatar'),userController.createUserNoRegister)
router.post('/sign-in',userController.loginUser)
router.post('/log-out',userController.logoutUser)
router.put('/update-user/:id',authUserMiddleware,uploadCloud.single('avatar'),userController.updateUser)
router.put('/update-password-user',userController.updateUserNewPassword)
router.delete('/delete-user/:id',authMiddleware,userController.deleteUser)
router.get('/get-all',authMiddleware,userController.getAllUser);
router.get('/get-details/:id',authUserMiddleware,userController.getDetailUser);
router.post('/refresh-token/',userController.refreshToken);
router.post('/delete-many',authMiddleware,userController.deleteManyUser)

module.exports = router;