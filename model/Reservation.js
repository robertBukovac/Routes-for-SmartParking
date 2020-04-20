const mongoose = require('mongoose');


const ReservationSchema = new mongoose.Schema({
  parking: {
    type: String,
    required: [true,'Please add a wanted parking'],
  },
  date: {
    type: Date,
    required: [true, 'Please add a date'],
  },
  time: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  //createdAt: {
  //  type: Date,
  //  default: Date.now,
  //  },
 
   } );


ReservationSchema.set('timestamps', true);
//ReservationSchema.plugin(timeZone, { paths: ['createdAt'] });
module.exports = mongoose.model('Reservation', ReservationSchema);