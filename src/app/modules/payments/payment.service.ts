import { Payment, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import {
  IPaymentFiltersRequest,
  PaymentSearchAbleFields,
} from './payment.interface';

const createPayment = async (data: Payment) => {
  console.log('service:', data);
  const result = await prisma.payment.create({ data });

  return result;
};

const getAllPayment = async (
  filters: IPaymentFiltersRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Payment[]>> => {
  const { page, skip, limit } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  console.log('options service:', options);
  console.log('filters service:', filters);
  const andConditons = [];

  if (searchTerm) {
    andConditons.push({
      OR: PaymentSearchAbleFields.map(field => ({
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
  const whereConditons: Prisma.PaymentWhereInput =
    andConditons.length > 0 ? { AND: andConditons } : {};

  const result = await prisma.payment.findMany({
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

const getPayment = async (id: string): Promise<Payment | null> => {
  const result = await prisma.payment.findUnique({
    where: { id },
  });
  return result;
};

const updatePayment = async (
  id: string,
  payload: Payment
): Promise<Payment | null> => {
  const result = await prisma.payment.update({
    where: { id },
    data: payload,
  });

  return result;
};

const deletePayment = async (id: string): Promise<Payment | null> => {
  const result = await prisma.payment.delete({ where: { id } });
  return result;
};
export const PaymentService = {
  createPayment,
  getAllPayment,
  getPayment,
  updatePayment,
  deletePayment,
};
