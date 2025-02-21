const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const Room = require ('../model/room');
const AppError = require('../utils/AppError')
const { allocateRoom } = require('../controllers/allocate');
// Register
router.post('/register', async (req, res) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // Create new user
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword
    });
    // Allocate Room
    const room = await allocateRoom(newUser._id);
    try{
      res.status(201).json({
        message: 'Signup successful',
        user: newUser,
        allocatedRoom: room,
      });
      await room.save()
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
    // Save user
    const savedUser = await newUser.save();
    const { password, ...userWithoutPassword } = savedUser._doc;
    
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    const { password, ...userWithoutPassword } = user._doc;
    
    res.status(200).json({ 
        status:"success",
      ...userWithoutPassword, 
      token 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

});

module.exports = router;