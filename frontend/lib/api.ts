import { Book, BooksResponse, BookFilters, BookStats } from '@/types/book';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export class BookAPI {
  static async getBooks(
    page: number = 1,
    limit: number = 20,
    filters: BookFilters = {}
  ): Promise<BooksResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    // Add filters to params
    if (filters.search) params.append('search', filters.search);
    if (filters.rating) params.append('rating', filters.rating.toString());
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.inStock !== undefined) params.append('inStock', filters.inStock.toString());

    const response = await fetch(`${API_BASE_URL}/books?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }

    return response.json();
  }

  static async getBookById(id: string): Promise<{ success: boolean; data: Book }> {
    const response = await fetch(`${API_BASE_URL}/books/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch book');
    }

    return response.json();
  }

  static async refreshBooks(): Promise<{ success: boolean; message: string; totalBooks: number }> {
    console.log('Calling refresh API at:', `${API_BASE_URL}/books/refresh`);
    
    const response = await fetch(`${API_BASE_URL}/books/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Refresh API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Refresh API error:', errorText);
      throw new Error('Failed to refresh books');
    }

    const result = await response.json();
    console.log('Refresh API result:', result);
    return result;
  }

  static async getStats(): Promise<{ success: boolean; data: BookStats }> {
    const response = await fetch(`${API_BASE_URL}/books/stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }

    return response.json();
  }
}