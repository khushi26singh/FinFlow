const express = require('express');
const { getUsers, updateRole } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', protect, authorize('admin'), getUsers);
router.patch('/:id/role', protect, authorize('admin'), updateRole);

module.exports = router;