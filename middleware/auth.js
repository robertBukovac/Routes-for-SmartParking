const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../model/User');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // jer u postmanu u headersu u authorization dijelu isemo Bearer pa token pa to odvajamo da dobijemo token
    token = req.headers.authorization.split(' ')[1];
  } // else if (req.cookies.token) {
  // token = req.cookies.token;
  //}

  //Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  
  //if exits we need to verify
  try {
    //Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});


// Grant acces to specific roles
exports.authorize = (role) => {
  return (req, res, next) => {
    if (role !== req.user.role ) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to acces this route`,
          403
        )
      );
    }
    next();
  };
};