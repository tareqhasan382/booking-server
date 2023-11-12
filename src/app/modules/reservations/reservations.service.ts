import { Prisma, ReservedBook } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import {
  IReservation,
  IReserveFiltersRequest,
  ReserveSearchAbleFields,
} from './reservations.interface';

const createReserve = async (data: ReservedBook) => {
  console.log('service:', data);
  const result = await prisma.reservedBook.create({ data });

  return result;
};

const getAllReserve = async (
  filters: IReserveFiltersRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<ReservedBook[]>> => {
  const { page, skip, limit } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  console.log('options service:', options);
  console.log('filters service:', filters);
  const andConditons = [];

  if (searchTerm) {
    andConditons.push({
      OR: ReserveSearchAbleFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditons.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  //ReservationsWhereInput
  const whereConditons: Prisma.ReservedBookWhereInput =
    andConditons.length > 0 ? { AND: andConditons } : {};

  const result = await prisma.reservedBook.findMany({
    where: whereConditons,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: 'desc',
          },
  });

  const total = await prisma.trips.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};
// where: { tripsId: id }, || userId
const getReserve = async (id: string): Promise<IReservation[] | null> => {
  const result = await prisma.reservedBook.findMany({
    where: { userId: id },
    include: {
      trips: true,
    },
  });
  return result;
};

const updateReserve = async (
  id: string,
  payload: IReservation
): Promise<IReservation | null> => {
  const result = await prisma.reservedBook.update({
    where: { id },
    data: payload,
  });

  return result;
};

const deleteReserve = async (id: string): Promise<IReservation | null> => {
  const result = await prisma.reservedBook.delete({ where: { id } });
  return result;
};
export const ReservationService = {
  createReserve,
  getAllReserve,
  getReserve,
  updateReserve,
  deleteReserve,
};
