const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../model/User')

 const express = require('express');
 const {
   register,
   login,
   getMe,
   getUsersReservation
 } = require('../controllers/auth');
 
 const router = express.Router();
 
 const { protect } = require('../middleware/auth');
 
 router.post('/register', register);
 router.post('/login', login);
 router.get('/me', protect, getMe);
router.get('/myreserv',protect,getUsersReservation)
module.exports = router