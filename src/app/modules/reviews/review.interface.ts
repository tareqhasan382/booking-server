// // id, rating,comment,userId,tripsId

export type IReview = {
  id?: string;
  rating: number;
  comment: string;
  userId?: string;
  tripsId?: string;
};

export type IReviewFiltersRequest = {
  searchTerm?: string;
};
export const ReviewtSearchAbleFields = ['rating', 'comment', 'tripsId'];

export const ReviewFilterAbleFileds = [
  'searchTerm',
  'status',
  'totalPrice',
  'sortBy',
  'sortOrder',
];
