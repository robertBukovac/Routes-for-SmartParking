const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../model/User');
const Reservation = require('../model/Reservation');


// @desc Register User
// @route POST /api/auth/register
// @acces Public

exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;
  
    //Create User
    const user = await User.create({
      name,
      email,
      password,
      role,
    });
    
    sendTokenResponse(user, 200, res);
  });

// @desc Login User
// @route POST /api/v1/auth/login
// @acces Public

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
  
    // Validate email & password
    if (!email || !password) {
      return next(
        new ErrorResponse('Please provide an email and a password', 400)
      );
    }
    //Check for User                 mozemo staviti samo email,jer je isto ime varijable
    const user = await User.findOne({ email: email }).select('+password');
    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }
  
    //Check if password matches
    const isMatch = await user.matchPassword(password);
  
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }
    
    sendTokenResponse(user, 200, res);
  });


// @desc Get current logged in user
// @route GET /api/auth/me
// @acces Private

exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).populate({
      path: 'reservation',
      select: 'parking time',
    });
  

    res.status(200).json({ success: true, data: user });
  });


// @desc Get current logged in users reservation
// @route get /api/user/myreservations
// @acces Private

exports.getUsersReservation = asyncHandler(async (req, res, next) => {
  
  const reservation = await Reservation.find();
  //console.log(req.user.id)

  let myReservations = reservation.filter(data => req.user.id == data.user )

  console.log(myReservations)
  res.status(201).json({sucess:true,data:myReservations})

  });


  // Get token from model,create cookie and send response 
const sendTokenResponse = (user,statusCode,res) => {
    // Create token
    const token = user.getSignedJWToken()
    
    const options = {
      // 30 days
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE *24 *60 *60 *1000),
      httpOnly:true
    }
    // KADA APLIKACIJA ISLA ZA PRODUKCIJU OKRENUTI DA COOKIE BUDU SECURE (https valid)
    
    res.status(statusCode).cookie('token',token,options).json({succes:true,token})
  }