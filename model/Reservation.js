const mongoose = require('mongoose');
const timeZone = require('mongoose-timezone');


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
  createdAt: {
    type: Date,
    default: Date.now,
    },
 
   },{
     toJSON:{
        virtuals:true,
        toObject: { virtuals:true}
     }
   } );

// Reverse populate with virtuals
ReservationSchema.virtual('users',{
  ref:'User',
  localField:'_id',
  foreignField: 'reservation',
  justOne: false
})


ReservationSchema.plugin(timeZone, { path: ['createdAt'] });
module.exports = mongoose.model('Reservation', ReservationSchema);