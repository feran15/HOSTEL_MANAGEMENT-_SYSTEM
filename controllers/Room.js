// controllers/roomController.js
const Room = require('../model/room');
const Student = require('../model/user');
const  roomController = {
  // Get all rooms
  getAllRooms: async (req, res) => {
    try {
      const rooms = await Room.find(req.params)
        .populate('occupants', 'name email phone')
        .sort({ roomNumber: 1 });
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get single room
  getRoom: async (req, res) => {
    try {
      const room = await Room.findById(req.params.id)
        .populate('occupants', 'name email phone');
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
      res.json(room);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create new room
  createRoom: async (req, res) => {
    try {
      const newRoom = new Room(req.body);
      const savedRoom = await newRoom.save();
      res.status(201).json(savedRoom);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update room
  updateRoom: async (req, res) => {
    try {
      const updatedRoom = await Room.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedRoom) {
        return res.status(404).json({ message: 'Room not found' });
      }
      res.json(updatedRoom);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete room
  deleteRoom: async (req, res) => {
    try {
      const room = await Room.findById(req.params.id);
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
      if (room.occupants.length > 0) {
        return res.status(400).json({ message: 'Cannot delete room with occupants' });
      }
      await room.remove();
      res.json({ message: 'Room deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Allocate room to student
  allocateRoom: async (req, res) => {
    try {
      const { roomId, studentId } = req.body;
      
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }

      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      // Check if room is full
      if (room.occupants.length >= room.capacity) {
        return res.status(400).json({ message: 'Room is fully occupied' });
      }

      // Check if student is already allocated
      if (student.room) {
        return res.status(400).json({ message: 'Student already has a room allocated' });
      }

      // Add student to room
      room.occupants.push(studentId);
      await room.save();

      // Update student's room
      student.room = roomId;
      await student.save();

      res.json({ message: 'Room allocated successfully', room });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Deallocate room from student
  deallocateRoom: async (req, res) => {
    try {
      const { roomId, studentId } = req.body;
      
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }

      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      // Remove student from room
      room.occupants = room.occupants.filter(
        occupant => occupant.toString() !== studentId
      );
      await room.save();

      // Remove room from student
      student.room = null;
      await student.save();

      res.json({ message: 'Room deallocated successfully', room });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get available rooms
  getAvailableRooms: async (req, res) => {
    try {
      const rooms = await Room.find({
        $or: [
          { status: 'Available' },
          { status: 'Partially Filled' }
        ]
      }).populate('occupants', 'name');
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Search rooms
  searchRooms: async (req, res) => {
    try {
      const { block, roomType, status, minRent, maxRent } = req.query;
      
      const query = {};
      if (block) query.block = block;
      if (roomType) query.roomType = roomType;
      if (status) query.status = status;
      if (minRent || maxRent) {
        query.monthlyRent = {};
        if (minRent) query.monthlyRent.$gte = minRent;
        if (maxRent) query.monthlyRent.$lte = maxRent;
      }

      const rooms = await Room.find(query).populate('occupants', 'name');
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = roomController; 