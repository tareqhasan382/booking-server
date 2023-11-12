import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { ReservationControlller } from './reservations.controller';

const router = express.Router();
router.post(
  '/order',
  auth(ENUM_USER_ROLE.USER),
  ReservationControlller.createReserve
);
router.get(
  '/orders',
  auth(ENUM_USER_ROLE.USER),
  ReservationControlller.getReserves
);
router.get(
  '/orders/:id',
  auth(ENUM_USER_ROLE.USER),
  ReservationControlller.getReserve
);
router.patch(
  '/order/:id',
  auth(ENUM_USER_ROLE.USER),
  ReservationControlller.updateReserve
);
router.delete(
  '/order/:id',
  auth(ENUM_USER_ROLE.USER),
  ReservationControlller.deleteReserve
);

export const ReservationsRoutes = router;
