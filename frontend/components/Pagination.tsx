'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  hasNextPage, 
  hasPrevPage 
}: PaginationProps) {
  const generatePageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2 mt-8">
      {/* Mobile: Simplified Navigation */}
      <div className="flex sm:hidden items-center space-x-2 w-full">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          className="flex-1 flex items-center justify-center space-x-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>
        
        <div className="flex items-center space-x-2 px-2">
          <span className="text-sm font-medium">{currentPage}</span>
          <span className="text-sm text-gray-500">of</span>
          <span className="text-sm font-medium">{totalPages}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className="flex-1 flex items-center justify-center space-x-1"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Desktop: Full Navigation */}
      <div className="hidden sm:flex items-center space-x-2">
        {/* First Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={!hasPrevPage}
          className="flex items-center space-x-1"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>

        {/* Previous Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          className="flex items-center space-x-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden md:inline">Previous</span>
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {generatePageNumbers().map((page, index) => (
            <Button
              key={index}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...'}
              className="min-w-[40px]"
            >
              {page}
            </Button>
          ))}
        </div>

        {/* Next Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className="flex items-center space-x-1"
        >
          <span className="hidden md:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>

        {/* Last Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNextPage}
          className="flex items-center space-x-1"
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}