import express from 'express';
import { ReservationControlller } from './reservations.controller';

const router = express.Router();
router.post('/order', ReservationControlller.createReserve);
router.get('/orders', ReservationControlller.getReserves);
router.get('/order/:id', ReservationControlller.getReserve);
router.patch('/order/:id', ReservationControlller.updateReserve);
router.delete('/order/:id', ReservationControlller.deleteReserve);

export const ReservationsRoutes = router;
