import express from 'express';
import { TripsControlller } from './trips.controller';

const router = express.Router();
router.post('/trip', TripsControlller.createTrip);
router.get('/trips', TripsControlller.getTrips);
router.get('/trips/:id', TripsControlller.getTrip);
router.patch('/trips/:id', TripsControlller.updateTrip);
router.delete('/trips/:id', TripsControlller.deleteTrip);

export const TripsRoutes = router;
