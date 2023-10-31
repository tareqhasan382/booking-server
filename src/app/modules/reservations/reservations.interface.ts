export type IReservation = {
  startDay: string;
  endDay: string;
  totalPrice: number;
  userId: string;
  tripsId: string;
};

export type IReserveFiltersRequest = {
  searchTerm?: string;
};
export const ReserveSearchAbleFields = ['status', 'startDay', 'endDay'];

export const ReserveFilterAbleFileds = [
  'searchTerm',
  'status',
  'totalPrice',
  'sortBy',
  'sortOrder',
];
