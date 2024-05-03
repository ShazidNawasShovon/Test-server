const router   = require('express').Router();
const {upload} = require('../middlewares/imageUpload');
const {loginUser,forgotPassword,resetPassword,createUser,getUsers,getUserById,updateUserById, deleteUserById,uploadImage} = require("../controllers/user.controller");

// User Routes
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/signup', createUser);
router.patch('/api/users/upload-image', upload, uploadImage);
router.get('/api/users', getUsers);
router.get('/api/users/:id', getUserById);
router.put('/api/users/:id', updateUserById);
router.delete('/api/users/:id', deleteUserById);

module.exports = router;