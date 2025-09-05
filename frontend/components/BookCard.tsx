'use client';

import { Book } from '@/types/book';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BookCardProps {
  book: Book;
  onSelect: (book: Book) => void;
}

export function BookCard({ book, onSelect }: BookCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'fill-gray-200 text-gray-200'
        }`}
      />
    ));
  };

  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden h-full flex flex-col">
      <div className="aspect-[3/4] relative overflow-hidden bg-gray-50">
        <img
          src={book.thumbnailUrl}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            console.log('Image failed to load:', book.thumbnailUrl);
            target.src = 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop';
          }}
          onLoad={() => {
            console.log('Image loaded successfully:', book.thumbnailUrl);
          }}
        />
        <div className="absolute top-2 right-2">
          <Badge variant={book.inStock ? "default" : "destructive"} className="text-xs">
            {book.inStock ? 'In Stock' : 'Out of Stock'}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-3 sm:p-4 flex-1 flex flex-col">
        <div className="space-y-2 sm:space-y-3 flex-1 flex flex-col">
          <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] leading-4 sm:leading-5 flex-1">
            {book.title}
          </h3>
          
          <div className="flex items-center space-x-1">
            {renderStars(book.rating)}
            <span className="text-xs sm:text-sm text-gray-600 ml-1 sm:ml-2">
              ({book.rating}/5)
            </span>
          </div>
          
          <div className="flex items-center justify-between pt-1">
            <span className="text-base sm:text-lg font-bold text-emerald-600">
              {book.priceText}
            </span>
            <Button 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                onSelect(book);
              }}
              className="flex items-center space-x-1 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
            >
              <span>View</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}