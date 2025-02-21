const express = require("express");
const Room = require('../model/room');
const User = require('../model/user');

// Allocate room to a user
const allocateRoom = async (userId) => {
  try {
    // Find an available room
    const room = await Room.findOne({ status: { $ne: 'Fully Occupied' } }).sort('block');
    if (!room) {
      throw new Error('No available rooms');
    }

    // Add the user to the room
    room.occupants.push(userId);
    if (room.occupants.length === room.capacity) {
      room.status = 'Fully Occupied';
    } else {
      room.status = 'Partially Filled';
    }
    await room.save();

    return room;
  } catch (error) {
    throw error;
  }
};

// Vacate room for a user
const vacateRoom = async (userId) => {
  try {
    // Find the room where the user is an occupant
    const room = await Room.findOne({ occupants: userId });
    if (!room) {
      throw new Error('User is not assigned to any room');
    }

    // Remove user from the room
    room.occupants = room.occupants.filter((occupant) => occupant.toString() !== userId.toString());
    room.status = room.occupants.length === 0 ? 'Available' : 'Partially Filled';
    await room.save();

    return room;
  } catch (error) {
    throw error;
  }
};

// Export functions
module.exports = { allocateRoom, vacateRoom };
