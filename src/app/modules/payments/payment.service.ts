/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaymentStatus, Payments, Prisma, StatusRole } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import { sslService } from '../ssl/ssl.service';
import { paymentSearchableFields } from './payment.constants';
function generateRandomId() {
  const min = 10000; // Minimum value (inclusive)
  const max = 99999; // Maximum value (inclusive)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const initPayment = async (data: any) => {
  const transactionId = generateRandomId().toString();
  console.log('transactionId:', transactionId);
  const { name, phone, price, reservedBookId } = data;

  const paymentSession = await sslService.initPayment({
    total_amount: parseInt(price),
    tran_id: transactionId,
    cus_name: name,
    cus_email: data.email,
    cus_add1: data.locationValue,
    cus_phone: phone,
  });

  await prisma.payments.create({
    data: {
      amount: parseInt(price),
      transactionId: transactionId,
      reservedBookId: reservedBookId,
      paymentGatewayData: data,
    },
  });

  console.log('paymentSession:', paymentSession.GatewayPageURL);
  return paymentSession.GatewayPageURL;
};
const success = async (payload: string) => {
  // console.log('payload', payload);
  const transactionId: string = payload;
  const result = await prisma.payments.updateMany({
    where: {
      transactionId: transactionId,
    },
    data: {
      status: PaymentStatus.PAID,
    },
  });
  if (result.count > 0) {
    const findInfo = await prisma.payments.findFirst({
      where: {
        transactionId: payload,
      },
    });
    await prisma.reservedBook.update({
      where: {
        id: findInfo?.reservedBookId,
      },
      data: {
        status: StatusRole.confirmed,
      },
    });
  }
  return result;
};
const faield = async (payload: string) => {
  console.log('payload', payload);
  const findInfo = await prisma.payments.findFirst({
    where: {
      transactionId: payload,
    },
  });
  const result = await prisma.payments.delete({
    where: {
      id: findInfo?.id,
    },
  });

  return result;
};
const webhook = async (payload: any) => {
  console.log('params:', payload);
  if (!payload || !payload?.status || payload?.status !== 'VALID') {
    return {
      massage: 'Invalid Payment!',
    };
  }
  const result = await sslService.validate(payload);

  if (result?.status !== 'VALID') {
    return {
      massage: 'Payment failed',
    };
  }

  const { tran_id } = result;
  await prisma.payments.updateMany({
    where: {
      transactionId: tran_id,
    },
    data: {
      status: PaymentStatus.PAID,
      paymentGatewayData: payload,
    },
  });

  return {
    massage: 'Payment Success',
  };
};

const getAllFromDB = async (
  filters: any,
  options: any
): Promise<IGenericResponse<Payments[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: paymentSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  // PaymentWhereInput
  const whereConditions: Prisma.PaymentsWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.payments.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
  });
  const total = await prisma.payments.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<Payments | null> => {
  console.log(id);
  const result = await prisma.payments.findFirst({
    where: {
      transactionId: id,
    },
  });
  console.log(result);
  return result;
};

export const PaymentService = {
  initPayment,
  success,
  faield,
  webhook,
  getAllFromDB,
  getByIdFromDB,
};
