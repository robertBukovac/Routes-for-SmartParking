const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../model/User');
const Reservation = require('../model/Reservation');

// @desc GET all reservations
// @route GET /api/reservations
// @acces Public
exports.getReservations = asyncHandler(async (req, res, next) => {

    const reservations = await Reservation.find().populate({
      path: 'user',
      select: 'name email',
    });

    res.status(200).json({success: true, data: reservations})
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

  
// @desc Create parking reservations
// @route POST /api/reservations
// @acces Private

exports.addReservation = asyncHandler(async (req, res, next) => {
    //da dobijemo trenutno prijavljenog usera i da ga ubacimo u body
    req.body.user = req.user.id; 
 
    const parking = await Reservation.create(req.body);
   
     res.status(201).json({sucess:true,data:parking})
    });

// @desc Update parking reservation
// @route PUT /api/reservations/:id
// @acces Private

exports.updateReservation = asyncHandler(async (req, res, next) => {

  let reservation = await Reservation.findById(req.params.id)

  if(!reservation){
    return next(new ErrorResponse(`No reservation with id of ${req.params.id}`,404))
  }

  //Make sure reservation belongs to user or user is a admin (ZATO JER JE OBJECTID RADIMO TOSTRING())
  if(reservation.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(new ErrorResponse(`Not authorized to update reservation`,401))
    }

  reservation = await Reservation.findByIdAndUpdate(req.params.id,req.body,{
      new:true,
      runValidators:true
    })
   
  res.status(201).json({sucess:true,data:reservation})

  });

// @desc Delete parking reservation
// @route Delete /api/reservations/:id
// @acces Private

exports.deleteReservation = asyncHandler(async (req, res, next) => {
  
  const reservation = await Reservation.findById(req.params.id)

  if(!reservation){
    return next(new ErrorResponse(`No reservation with id of ${req.params.id}`,404))
  }

  //Make sure reservation belongs to user or user is a admin (ZATO JER JE OBJECTID RADIMO TOSTRING())
  if(reservation.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(new ErrorResponse(`Not authorized to delete reservation`,401))
    }

  await reservation.remove()
   
  res.status(201).json({sucess:true,data:{}})

  });

