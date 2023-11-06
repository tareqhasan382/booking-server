import { Prisma, Reviews } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import {
  IReviewFiltersRequest,
  ReviewtSearchAbleFields,
} from './review.interface';

const createReview = async (data: Reviews) => {
  console.log('service:', data);
  const result = await prisma.reviews.create({ data });

  return result;
};

const getAllReview = async (
  filters: IReviewFiltersRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Reviews[]>> => {
  const { page, skip, limit } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  console.log('options service:', options);
  console.log('filters service:', filters);
  const andConditons = [];

  if (searchTerm) {
    andConditons.push({
      OR: ReviewtSearchAbleFields.map(field => ({
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
  const whereConditons: Prisma.ReviewsWhereInput =
    andConditons.length > 0 ? { AND: andConditons } : {};

  const result = await prisma.reviews.findMany({
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

const getReview = async (id: string): Promise<Reviews[] | null> => {
  // console.log(id);
  const result = await prisma.reviews.findMany({
    where: { tripsId: id },
  });
  return result;
};

const updateReview = async (
  id: string,
  payload: Reviews
): Promise<Reviews | null> => {
  const result = await prisma.reviews.update({
    where: { id },
    data: payload,
  });

  return result;
};

const deleteReview = async (id: string): Promise<Reviews | null> => {
  const result = await prisma.reviews.delete({ where: { id } });
  return result;
};
export const ReviewService = {
  createReview,
  getAllReview,
  getReview,
  updateReview,
  deleteReview,
};
