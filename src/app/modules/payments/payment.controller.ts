import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { paymentFilterableFields } from './payment.constants';
import { PaymentService } from './payment.service';
const initPayment = async (req: Request, res: Response) => {
  // console.log('Data:', req.body);
  const result = await PaymentService.initPayment(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment Request created successfully',
    data: result,
  });
};
const success = async (req: Request, res: Response) => {
  console.log('success  Data:', req.params.tranId);
  const result = await PaymentService.success(req.params.tranId);
  if (result.count > 0) {
    res.redirect(
      `https://booking-fontend.vercel.app/payment/success/${req.params.tranId}`
    );
  }
};
const fail = async (req: Request, res: Response) => {
  console.log('success  Data:', req.params.tranId);
  const result = await PaymentService.faield(req.params.tranId);
  if (result) {
    res.redirect(
      `https://booking-fontend.vercel.app/payment/fail/${req.params.tranId}`
    );
  }
};
const webhook = async (req: Request, res: Response) => {
  const result = await PaymentService.webhook(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment verified!',
    data: result,
  });
};

const getAllFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filters = pick(req.query, paymentFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await PaymentService.getAllFromDB(filters, options);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Payments fetched successfully',
      meta: result.meta,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

const getByIdFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await PaymentService.getByIdFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Payment fetched successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const PaymentController = {
  initPayment,
  success,
  fail,
  webhook,
  getAllFromDB,
  getByIdFromDB,
};
