//id, amount, reservedBookId

export type IPayment = {
  id?: string;
  amount: number;
  reservedBookId?: string;
};

export type IPaymentFiltersRequest = {
  searchTerm?: string;
};
export const PaymentSearchAbleFields = ['status', 'startDay', 'endDay'];

export const PaymentFilterAbleFileds = [
  'searchTerm',
  'status',
  'totalPrice',
  'sortBy',
  'sortOrder',
];
