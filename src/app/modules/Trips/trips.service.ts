/* eslint-disable @typescript-eslint/no-explicit-any */
import { Trips } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { ITripsFiltersRequest, TripsSearchAbleFields } from './trips.interface';

const createTrip = async (data: Trips) => {
  console.log('service:', data);
  const result = await prisma.trips.create({ data });

  return result;
};
//http://localhost:5000/api/v1/trips?limit=2&page=3
const getTrips = async (
  filters: ITripsFiltersRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Trips[]>> => {
  const { page, skip, limit } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  // console.log('options service:', options);
  // console.log('filters service:', filters);
  const andConditons = [];

  if (searchTerm) {
    andConditons.push({
      OR: TripsSearchAbleFields.map(field => ({
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
  // BooksWhereInput
  // const whereConditons: Prisma.TripsWhereInput =
  //   andConditons.length > 0 ? { AND: andConditons } : {};

  //const result = await prisma.books.findMany();
  const result = await prisma.trips.findMany({
    where: {
      locationValue: {
        contains: searchTerm,
        mode: 'insensitive',
      },
    },
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
    // include: { category: { select: { title: true } } },
  });

  const total = await prisma.trips.count(); //const totalCount = await prisma.books.count({ where });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getTrip = async (id: string): Promise<Trips | null> => {
  const result = await prisma.trips.findUnique({
    where: { id },
  });
  return result;
};

const updateTrip = async (
  id: string,
  payload: Trips
): Promise<Trips | null> => {
  const result = await prisma.trips.update({
    where: { id },
    data: payload,
  });

  return result;
};

const deleteTrips = async (id: string): Promise<Trips | null> => {
  const result = await prisma.trips.delete({ where: { id } });
  return result;
};
export const TripsService = {
  createTrip,
  getTrips,
  getTrip,
  updateTrip,
  deleteTrips,
};
