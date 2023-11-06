import { Reviews } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { ReviewFilterAbleFileds } from './review.interface';
import { ReviewService } from './review.service';

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.createReview(req.body);
  sendResponse<Reviews>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reviews created successfully !!',
    data: result,
  });
});
const getReviews = catchAsync(async (req: Request, res: Response) => {
  try {
    // ?page=1&limit=3    ||  BookFilterAbleFileds
    const filters = pick(req.query, ReviewFilterAbleFileds);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await ReviewService.getAllReview(filters, options); //BookService.getBooks(filters, options);
    res.status(200).json({
      statusCode: httpStatus.OK,
      success: true,
      message: 'Reviews retrive successfully !!',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'somthing went wrong !!',
      data: error,
    });
  }
});

const getReview = catchAsync(async (req: Request, res: Response) => {
  try {
    const result = await ReviewService.getReview(req.params.id);
    sendResponse<Reviews[] | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Reviews retrieved successfully !!',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'somthing went wrong !!',
      data: error,
    });
  }
});
const updateReview = catchAsync(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const result = await ReviewService.updateReview(id, payload); // BookService.updateBook(id, payload);
    if (result) {
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Reviews updated successfully !!',
      });
    }
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'somthing went wrong!!',
      data: error,
    });
  }
});
const deleteReview = catchAsync(async (req: Request, res: Response) => {
  try {
    const result = await ReviewService.deleteReview(req.params.id);
    sendResponse<Reviews>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Reviews deleted successfully !!',
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'somthing went wrong!!',
      data: error,
    });
  }
});
export const ReviewsControlller = {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
};
