'use client';

import { Book } from '@/types/book';
import { BookCard } from './BookCard';

interface BookGridProps {
  books: Book[] | undefined;
  onBookSelect: (book: Book) => void;
}

export function BookGrid({ books, onBookSelect }: BookGridProps) {
  if (!books || books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold mb-2">No books found</h3>
        <p className="text-center max-w-md">
          Try adjusting your search criteria or filters to find more books.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
      {books.map((book) => (
        <BookCard
          key={book._id}
          book={book}
          onSelect={onBookSelect}
        />
      ))}
    </div>
  );
}