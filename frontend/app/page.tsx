'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BookFilters } from '@/components/BookFilters';
import { BookGrid } from '@/components/BookGrid';
import { BookDetail } from '@/components/BookDetail';
import { Pagination } from '@/components/Pagination';
import { BookAPI } from '@/lib/api';
import { Book, BookFilters as BookFiltersType, BooksResponse } from '@/types/book';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/sonner';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [filters, setFilters] = useState<BookFiltersType>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(20);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBooks: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const { toast } = useToast();

  // Calculate books per page based on screen size
  useEffect(() => {
    const calculateBooksPerPage = () => {
      const width = window.innerWidth;
      let cols = 1; // Default mobile
      
      if (width >= 1536) cols = 6;      // 2xl: 6 columns
      else if (width >= 1280) cols = 5; // xl: 5 columns  
      else if (width >= 1024) cols = 4; // lg: 4 columns
      else if (width >= 768) cols = 3;  // md: 3 columns
      else if (width >= 640) cols = 2;  // sm: 2 columns
      else cols = 1;                    // mobile: 1 column
      
      // Calculate rows that fit in viewport (approximate)
      const headerHeight = 80;
      const filtersHeight = 120;
      const paginationHeight = 80;
      const availableHeight = window.innerHeight - headerHeight - filtersHeight - paginationHeight;
      const cardHeight = 400; // Approximate card height
      const rows = Math.max(3, Math.floor(availableHeight / cardHeight));
      
      const calculated = cols * rows;
      // If calculated amount leaves space for one more, add it
      const withExtra = calculated + (calculated % cols === 0 ? cols : cols - (calculated % cols));
      
      setBooksPerPage(Math.max(12, Math.min(withExtra, 50))); // Min 12, max 50
    };

    calculateBooksPerPage();
    
    const handleResize = () => {
      calculateBooksPerPage();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchBooks = async (page: number = 1, searchFilters: BookFiltersType = {}) => {
    setLoading(true);
    try {
      const response: BooksResponse = await BookAPI.getBooks(page, booksPerPage, searchFilters);
      
      if (response.success) {
        setBooks(response.data.books);
        setPagination(response.data.pagination);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch books",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      // Reset to safe defaults on error
      setBooks([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalBooks: 0,
        hasNextPage: false,
        hasPrevPage: false
      });
      toast({
        title: "Connection Error",
        description: "Could not connect to the server. Make sure the backend is running.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (booksPerPage > 0) {
      fetchBooks(1, {});
    }
  }, [booksPerPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchBooks(1, filters);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchBooks(page, filters);
  };

  const handleFiltersChange = (newFilters: BookFiltersType) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Filters */}
          <BookFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onSearch={handleSearch}
          />

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
              <span className="ml-2 text-base sm:text-lg mt-2">Loading books...</span>
            </div>
          )}

          {/* Books Grid */}
          {!loading && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {pagination && pagination.totalBooks > 0 
                    ? `Found ${pagination.totalBooks} book${pagination.totalBooks === 1 ? '' : 's'}`
                    : 'No books found'
                  }
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  Page {pagination?.currentPage || 1} of {pagination?.totalPages || 1}
                </p>
              </div>

              <BookGrid 
                books={books} 
                onBookSelect={setSelectedBook} 
              />

              {/* Pagination */}
              <Pagination
                currentPage={pagination?.currentPage || 1}
                totalPages={pagination?.totalPages || 1}
                hasNextPage={pagination?.hasNextPage || false}
                hasPrevPage={pagination?.hasPrevPage || false}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </main>

      {/* Book Detail Modal */}
      <BookDetail
        book={selectedBook}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
      />

      <Toaster />
    </div>
  );
}