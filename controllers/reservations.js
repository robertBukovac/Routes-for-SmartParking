const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../model/User');
const Reservation = require('../model/Reservation');



// @desc Add parking reservations
// @route POST /api/parking
// @acces Private

exports.addReservation = asyncHandler(async (req, res, next) => {
   //da dobijemo trenutno prijavljenog usera i da ga ubacimo u body
   req.body.user = req.user.id; 

   const parking = await Reservation.create(req.body);
  
    res.status(201).json({sucess:true,data:parking})
  });
  
// @desc GET single reservation
// @route GET /api/reservations/:id
// @acces Public

exports.getReservation = asyncHandler(async (req, res, next) => {
    const reservation = await Reservation.findById(req.params.id);
  
    if (!reservation) {
      return next(
        new ErrorResponse(`No reservation with id of ${req.params.id}`),
        404
      );
    }
    res.status(200).json({
      sucess: true,
      data: reservation,
    });
  });