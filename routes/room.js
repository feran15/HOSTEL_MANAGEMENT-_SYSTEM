const express = require('express');
const router = express.Router();
const Room = require("../model/room");
const AppError = require("../utils/AppError");

// Create Room
router.post('/create', async (req, res, next) => {
  try {
    // Create new room
    const newRoom = new Room({
      roomNumber: req.body.roomNumber,
      roomType: req.body.roomType,
      block: req.body.block,
      capacity: req.body.capacity,
      occupants: req.body.occupants,
      status: req.body.status,
      monthlyRent: req.body.monthlyRent
    });

    // Save room
    const savedRoom = await newRoom.save();

    // Exclude the monthlyRent field from the response
    const { monthlyRent, ...roomWithoutRent } = savedRoom.toObject();

    res.status(201).json({
      status: 'success',
      room: roomWithoutRent
    });

  } catch (err) {
    // Handle validation errors
    if (err.name === 'ValidationError') {
      return next(new AppError(err.message, 400));
    }
    next(err);
  }
});
// Get All Rooms
router.get("/all", async (req, res, next) => {
  try {
    const rooms = await Room.find({});
    res.json(rooms);
  } catch (err) {
    next(err);
  }
});

// Get Single Room
router.get ("/:id", async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return next(new AppError("Room not found", 404));
    }
    res.json(room);
  } catch (err) {
    next(err);
  }
});

// Update Room
router.put("/:id", async (req, res, next) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          roomNumber: req.body.roomNumber,
          status: req.body.status
        }
      },
      { new: true }
    );
    res.json(updatedRoom);
  } catch (err) {
    next(err);
  }
});

// Delete Room
router.delete('/:id', async (req, res, next) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: 'Room deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;