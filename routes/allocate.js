const { allocateRoom } = require('../controllers/roomAllocationController');
const User = require('../models/User');

// Signup route
app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Create user
    const newUser = new User({ username, email, password });
    await newUser.save();

    // Allocate a room
    const room = await allocateRoom(newUser._id);

    res.status(200).json({ message: 'Signup successful and room allocated', room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
