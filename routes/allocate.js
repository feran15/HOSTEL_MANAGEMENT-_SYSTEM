
const Room = require('../model/room');
const AppError = require('../utils/AppError');

async function allocateRoom(userId) {
  // Find an available room
  const availableRooms = await Room.find({ status: 'available' });

  for (const room of availableRooms) {
    if (room.occupants.length < room.capacity) {
      // Assign the user to the room
      room.occupants.push(userId);

      // Update room status if it reaches full capacity
      if (room.occupants.length >= room.capacity) {
        room.status = 'occupied';
      }

      // Save the updated room
      await room.save();
      return room;
    }
  }

  // No available rooms
  throw new AppError('No available rooms', 400);
}

module.exports = { allocateRoom };