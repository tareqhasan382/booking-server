import express from 'express';
import { TripsRoutes } from '../modules/Trips/trips.route';
import { AuthRoutes } from '../modules/auth/auth.route';

import { paymentRoutes } from '../modules/payments/payment.route';
import { ReservationsRoutes } from '../modules/reservations/reservations.route';
import { ReviewRoutes } from '../modules/reviews/review.route';

const router = express.Router();

const moduleRoutes = [
  // ... routes

  {
    path: '/',
    route: AuthRoutes,
  },
  {
    path: '/',
    route: TripsRoutes,
  },
  {
    path: '/',
    route: ReservationsRoutes,
  },
  {
    path: '/',
    route: paymentRoutes,
  },
  {
    path: '/',
    route: ReviewRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
