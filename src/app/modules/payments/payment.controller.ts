import { Payment } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { PaymentFilterAbleFileds } from './payment.interface';
import { PaymentService } from './payment.service';

const createPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.createPayment(req.body);
  sendResponse<Payment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment created successfully !!',
    data: result,
  });
});
const getPayments = catchAsync(async (req: Request, res: Response) => {
  try {
    // ?page=1&limit=3    ||  BookFilterAbleFileds
    const filters = pick(req.query, PaymentFilterAbleFileds);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await PaymentService.getAllPayment(filters, options); //BookService.getBooks(filters, options);
    res.status(200).json({
      statusCode: httpStatus.OK,
      success: true,
      message: 'Payment retrive successfully !!',
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

const getPayment = catchAsync(async (req: Request, res: Response) => {
  try {
    const result = await PaymentService.getPayment(req.params.id);
    sendResponse<Payment>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Payment retrieved successfully !!',
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
const updatePayment = catchAsync(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const result = await PaymentService.updatePayment(id, payload); // BookService.updateBook(id, payload);
    if (result) {
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payment updated successfully !!',
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
const deletePayment = catchAsync(async (req: Request, res: Response) => {
  try {
    const result = await PaymentService.deletePayment(req.params.id);
    sendResponse<Payment>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Payment deleted successfully !!',
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
export const PaymentControlller = {
  createPayment,
  getPayments,
  getPayment,
  updatePayment,
  deletePayment,
};
