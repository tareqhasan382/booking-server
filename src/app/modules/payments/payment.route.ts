import express from 'express';
// import { ENUM_USER_ROLE } from '../../../enums/user';
// import auth from '../../middlewares/auth';
import { PaymentController } from './payment.controller';

const router = express.Router();

router.get('/payment', PaymentController.getAllFromDB);
router.get('/payment/:id', PaymentController.getByIdFromDB);
// auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
router.post('/payment/init', PaymentController.initPayment);
router.post('/payment/success/:tranId', PaymentController.success);
router.post('/payment/fail/:tranId', PaymentController.fail);

router.get('/payment/webhook', PaymentController.webhook);

export const paymentRoutes = router;
