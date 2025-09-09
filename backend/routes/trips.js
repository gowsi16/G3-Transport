const express = require('express');
const router = express.Router();
const { getAllTrips, createTrip, deleteTrip } = require('../controllers/tripController');

router.get('/', getAllTrips);
router.post('/', createTrip);
router.delete('/:id', deleteTrip);

module.exports = router;