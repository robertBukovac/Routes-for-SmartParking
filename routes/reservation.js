const express = require('express');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

const {
    addReservation,
    getReservation,
    getReservations,
    updateReservation,
    deleteReservation,
    getUsersReservation

} = require('../controllers/reservations');


const router = express.Router();

const Reservation = require('../model/Reservation');
const User = require('../model/User')

const advancedResults = require('../middleware/advancedResults');
const { protect,authorize } = require('../middleware/auth');


router
  .route('/').post(protect,addReservation)
  .get(protect,authorize('admin'),advancedResults(Reservation,'user'),getReservations);

router
  .route('/:id')
  .get(getReservation)
  .put(protect,updateReservation)
  .delete(protect,deleteReservation)

// router.route('/me').get(getUsersReservation)

  module.exports = router;
