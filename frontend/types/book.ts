export interface Book {
  _id: string;
  title: string;
  price: number;
  priceText: string;
  availability: string;
  inStock: boolean;
  rating: number;
  ratingText: string;
  detailPageUrl: string;
  thumbnailUrl: string;
  scrapedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface BooksResponse {
  success: boolean;
  data: {
    books: Book[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalBooks: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface BookFilters {
  search?: string;
  rating?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export interface BookStats {
  totalBooks: number;
  inStockBooks: number;
  outOfStockBooks: number;
  ratingDistribution: { _id: number; count: number }[];
  priceStats: {
    avgPrice: number;
    minPrice: number;
    maxPrice: number;
  };
}