const router = require('express').Router()
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../model/User')

//// REGISTER 
router.post('/register', asyncHandler (async (req,res,next) => {
    const { name, email, password, role } = req.body;

  //Create User
  const user = await User.create({
    name,
    email,
    password,
    role
  });
  
  sendTokenResponse(user,200,res)

}));

///// LOGIN
router.post('/login',asyncHandler( async (req,res,next) => {
    const { email, password } = req.body;

  if(!email || !password){
    return next(
        new ErrorResponse('Please provide an email and a password', 400)
      );
  }
    //Check for User    mozemo staviti samo email,jer je isto ime varijable
    const user = await User.findOne({ email:email }).select('+password');

    console.log(user)
    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
      }

    //Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
      }
    
      sendTokenResponse(user,200,res);

}));

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

module.exports = router