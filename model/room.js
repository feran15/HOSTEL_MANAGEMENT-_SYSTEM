const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true, trim: true },
  block: { type: String, required: true, trim: true },
  capacity: { type: Number, required: true, default: 2 },
  occupants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  roomType: { type: String, enum: ['Single', 'Double', 'Triple'], required: true },
  status: { type: String, enum: ['Available', 'Partially Filled', 'Fully Occupied', 'Under Maintenance'], default: 'Available' },
  monthlyRent: { type: String, required: true },
}, { timestamps: true });

roomSchema.pre('save', function(next) {
  if (this.occupants.length === 0) {
    this.status = 'Available';
  } else if (this.occupants.length < this.capacity) {
    this.status = 'Partially Filled';
  } else {
    this.status = 'Fully Occupied';
  }
  next();
});

// Check if the model already exists, use it; otherwise, create it
module.exports = mongoose.models.Room || mongoose.model('Room', roomSchema); 
