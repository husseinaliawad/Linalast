const express = require('express');
const { body } = require('express-validator');
const { listReports, resolveReport } = require('../controllers/reportController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/', auth, admin, listReports);

router.put(
  '/:id/resolve',
  auth,
  admin,
  [
    body('action').optional().isIn(['none', 'deleted', 'warned', 'banned']),
    body('status').optional().isIn(['open', 'resolved', 'dismissed']),
    body('adminNote').optional().isString(),
  ],
  validate,
  resolveReport
);

module.exports = router;
