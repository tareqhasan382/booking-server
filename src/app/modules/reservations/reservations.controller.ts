import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import {
  IReservation,
  ReserveFilterAbleFileds,
} from './reservations.interface';
import { ReservationService } from './reservations.service';

const createReserve = catchAsync(async (req: Request, res: Response) => {
  const result = await ReservationService.createReserve(req.body);
  sendResponse<IReservation>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reserved created successfully !!',
    data: result,
  });
});
const getReserves = catchAsync(async (req: Request, res: Response) => {
  try {
    // ?page=1&limit=3    ||  BookFilterAbleFileds
    const filters = pick(req.query, ReserveFilterAbleFileds);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await ReservationService.getAllReserve(filters, options); //BookService.getBooks(filters, options);
    res.status(200).json({
      statusCode: httpStatus.OK,
      success: true,
      message: 'Reserved retrive successfully !!',
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

const getReserve = catchAsync(async (req: Request, res: Response) => {
  try {
    const result = await ReservationService.getReserve(req.params.id);
    sendResponse<IReservation>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Reserve retrieved successfully !!',
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
const updateReserve = catchAsync(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const result = await ReservationService.updateReserve(id, payload); // BookService.updateBook(id, payload);
    if (result) {
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Reserve updated successfully !!',
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
const deleteReserve = catchAsync(async (req: Request, res: Response) => {
  try {
    const result = await ReservationService.deleteReserve(req.params.id);
    sendResponse<IReservation>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Reserve deleted successfully !!',
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
export const ReservationControlller = {
  createReserve,
  getReserves,
  getReserve,
  updateReserve,
  deleteReserve,
};
