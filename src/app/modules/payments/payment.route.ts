import express from 'express';
import { PaymentControlller } from './payment.controller';

const router = express.Router();
router.post('/payment', PaymentControlller.createPayment);
router.get('/payments', PaymentControlller.getPayments);
router.get('/payment/:id', PaymentControlller.getPayment);
router.patch('/payment/:id', PaymentControlller.updatePayment);
router.delete('/payment/:id', PaymentControlller.deletePayment);

export const PaymentRoutes = router;
