const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    role: {
      type: String,
      enum: ['professor', 'student'],
      default: 'professor',
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    }, 
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

  //Encrypt password using bcrypt
  UserSchema.pre('save', async function (next) {
  //if (!this.isModified('password')) {
  //  next();
  //}

  // ovo dvi linije ce biti pokrenute samo ako sifra bude modificirana
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sing JWT and return (zato sto je metoda (a ne statics) imamo pristup korisniku i njegovom id u )
UserSchema.methods.getSignedJWToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in DB
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Reverse populate with virtuals
UserSchema.virtual('reservations',{
  ref:'Reservation',
  localField:'_id',
  foreignField: 'user',
  justOne: false
})


  module.exports = mongoose.model('User', UserSchema);
