import express from 'express';
import { ReviewsControlller } from './review.controller';

const router = express.Router();
router.post('/review', ReviewsControlller.createReview);
router.get('/reviews', ReviewsControlller.getReviews);
router.get('/review/:id', ReviewsControlller.getReview);
router.patch('/review/:id', ReviewsControlller.updateReview);
router.delete('/review/:id', ReviewsControlller.deleteReview);

export const ReviewRoutes = router;
