const express = require('express');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

const {
    addReservation,
    getReservation,
    getReservations,
    updateReservation,
    deleteReservation

} = require('../controllers/reservations');

const router = express.Router();

const Reservation = require('../model/Reservation');

const { protect } = require('../middleware/auth');


router
  .route('/').post(protect,addReservation)
  .get(getReservations);

router
  .route('/:id')
  .get(getReservation)
  .put(protect,updateReservation)
  .delete(protect,deleteReservation)


  module.exports = router;