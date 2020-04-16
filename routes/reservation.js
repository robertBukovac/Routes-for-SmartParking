const express = require('express');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

const {
    addReservation,
    getReservation

} = require('../controllers/reservations');

const router = express.Router();

const Reservation = require('../model/Reservation');

const { protect } = require('../middleware/auth');


router
  .route('/').post(protect,addReservation);

router
  .route('/:id').get(getReservation);

  module.exports = router;
