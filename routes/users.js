const express = require('express');
const router = express.Router();
const User = require('../schemas/user');

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false }).populate('role');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET user by id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false }).populate('role');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE user
router.post('/', async (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl,
    status: req.body.status,
    role: req.body.role,
    loginCount: req.body.loginCount
  });
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE user
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (req.body.username) user.username = req.body.username;
    if (req.body.password) user.password = req.body.password;
    if (req.body.email) user.email = req.body.email;
    if (req.body.fullName !== undefined) user.fullName = req.body.fullName;
    if (req.body.avatarUrl) user.avatarUrl = req.body.avatarUrl;
    if (req.body.status !== undefined) user.status = req.body.status;
    if (req.body.role) user.role = req.body.role;
    if (req.body.loginCount !== undefined) user.loginCount = req.body.loginCount;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE user (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.isDeleted = true;
    await user.save();
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ENABLE user
router.post('/enable', async (req, res) => {
  try {
    const { email, username } = req.body;
    const user = await User.findOne({ email, username, isDeleted: false });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.status = true;
    await user.save();
    res.json({ message: 'User enabled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DISABLE user
router.post('/disable', async (req, res) => {
  try {
    const { email, username } = req.body;
    const user = await User.findOne({ email, username, isDeleted: false });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.status = false;
    await user.save();
    res.json({ message: 'User disabled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
