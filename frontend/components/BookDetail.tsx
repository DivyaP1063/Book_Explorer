'use client';

import { Book } from '@/types/book';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ExternalLink, Package, Calendar } from 'lucide-react';

interface BookDetailProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookDetail({ book, isOpen, onClose }: BookDetailProps) {
  if (!book) return null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'fill-gray-200 text-gray-200'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] w-[95vw] sm:w-full overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-2xl font-bold pr-8 leading-tight">
            {book.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
          {/* Book Image */}
          <div className="space-y-4 order-1 lg:order-1">
            <div className="aspect-[3/4] relative overflow-hidden rounded-lg bg-gray-50 max-w-sm mx-auto lg:max-w-none">
              <img
                src={book.thumbnailUrl}
                alt={book.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop';
                }}
              />
            </div>
          </div>

          {/* Book Details */}
          <div className="space-y-4 sm:space-y-6 order-2 lg:order-2">
            {/* Price and Availability */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-600">
                {book.priceText}
              </div>
              <Badge 
                variant={book.inStock ? "default" : "destructive"}
                className="text-sm w-fit"
              >
                {book.inStock ? 'In Stock' : 'Out of Stock'}
              </Badge>
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="flex items-center space-x-1">
                  {renderStars(book.rating)}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-base sm:text-lg font-medium">
                    {book.rating}/5
                  </span>
                  <span className="text-sm sm:text-base text-gray-600">
                    ({book.ratingText} stars)
                  </span>
                </div>
              </div>
            </div>

            {/* Availability Details */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">Availability:</span>
                </div>
                <span className="text-sm sm:text-base text-gray-700 break-words">{book.availability}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">Last Updated:</span>
                </div>
                <span className="text-sm sm:text-base text-gray-700">{formatDate(book.scrapedAt)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4">
              <Button 
                asChild 
                className="w-full"
                disabled={!book.inStock}
              >
                <a
                  href={book.detailPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View on Original Site</span>
                </a>
              </Button>
              
              {!book.inStock && (
                <p className="text-sm text-gray-500 text-center">
                  This book is currently out of stock
                </p>
              )}
            </div>

            {/* Book ID for reference */}
            <div className="pt-4 border-t">
              <p className="text-xs text-gray-400 break-all">
                Book ID: {book._id}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}