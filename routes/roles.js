const express = require('express');
const router = express.Router();
const Role = require('../schemas/role');

// GET all roles
router.get('/', async (req, res) => {
  try {
    const roles = await Role.find({ isDeleted: false });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET role by id
router.get('/:id', async (req, res) => {
  try {
    const role = await Role.findOne({ _id: req.params.id, isDeleted: false });
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE role
router.post('/', async (req, res) => {
  const role = new Role({
    name: req.body.name,
    description: req.body.description
  });
  try {
    const newRole = await role.save();
    res.status(201).json(newRole);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE role
router.put('/:id', async (req, res) => {
  try {
    const role = await Role.findOne({ _id: req.params.id, isDeleted: false });
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    if (req.body.name) role.name = req.body.name;
    if (req.body.description !== undefined) role.description = req.body.description;
    const updatedRole = await role.save();
    res.json(updatedRole);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE role (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const role = await Role.findOne({ _id: req.params.id, isDeleted: false });
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    role.isDeleted = true;
    await role.save();
    res.json({ message: 'Role deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;