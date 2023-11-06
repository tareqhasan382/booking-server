import { Trips } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { TripsFilterAbleFileds } from './trips.interface';
import { TripsService } from './trips.service';

const createTrip = catchAsync(async (req: Request, res: Response) => {
  console.log('body:', req.body);
  const result = await TripsService.createTrip(req.body);

  sendResponse<Trips>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Trips created successfully !!',
    data: result,
  });
});
const getTrips = catchAsync(async (req: Request, res: Response) => {
  try {
    // ?page=1&limit=3    ||  BookFilterAbleFileds
    const filters = pick(req.query, TripsFilterAbleFileds);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await TripsService.getTrips(filters, options); //BookService.getBooks(filters, options);
    res.status(200).json({
      statusCode: httpStatus.OK,
      success: true,
      message: 'Book retrive successfully !!',
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

const getTrip = catchAsync(async (req: Request, res: Response) => {
  try {
    const result = await TripsService.getTrip(req.params.id);
    res.status(200).json({
      statusCode: httpStatus.OK,
      success: true,
      message: 'Book retrive successfully !!',
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
const updateTrip = catchAsync(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const result = await TripsService.updateTrip(id, payload); // BookService.updateBook(id, payload);
    if (result) {
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Trip updated successfully !!',
      });
    }
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'somthing went wrong!! !!',
      data: error,
    });
  }
});
const deleteTrip = catchAsync(async (req: Request, res: Response) => {
  const result = await TripsService.deleteTrips(req.params.id);
  sendResponse<Trips>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Trips deleted successfully !!',
    data: result,
  });
});
export const TripsControlller = {
  createTrip,
  getTrips,
  getTrip,
  updateTrip,
  deleteTrip,
};
