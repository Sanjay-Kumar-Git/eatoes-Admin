const express = require('express');
const {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
  searchMenuItems
} = require('../controllers/menuController');

const router = express.Router();

// GET /api/menu
router.get('/', getMenuItems);

// GET /api/menu/search?q=
router.get('/search', searchMenuItems);

// GET /api/menu/:id
router.get('/:id', getMenuItemById);

// POST /api/menu
router.post('/', createMenuItem);

// PUT /api/menu/:id
router.put('/:id', updateMenuItem);

// DELETE /api/menu/:id
router.delete('/:id', deleteMenuItem);

// PATCH /api/menu/:id/availability
router.patch('/:id/availability', toggleAvailability);

module.exports = router;
