'use client';

import { useState } from 'react';
import { BookFilters as BookFiltersType } from '@/types/book';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Search, Filter, X } from 'lucide-react';

interface BookFiltersProps {
  filters: BookFiltersType;
  onFiltersChange: (filters: BookFiltersType) => void;
  onSearch: () => void;
}

export function BookFilters({ filters, onFiltersChange, onSearch }: BookFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof BookFiltersType, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== null
  );

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Search & Filter Books</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1 w-full sm:w-auto justify-center"
          >
            <Filter className="w-4 h-4" />
            <span>{isExpanded ? 'Hide' : 'Show'} Filters</span>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Input
            placeholder="Search books by title..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="flex-1"
          />
          <Button onClick={onSearch} className="flex items-center justify-center space-x-1 w-full sm:w-auto">
            <Search className="w-4 h-4" />
            <span>Search</span>
          </Button>
        </div>

        {/* Advanced Filters */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Rating Filter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Minimum Rating</Label>
                  {filters.rating && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateFilter('rating', undefined)}
                      className="h-auto p-1 text-xs"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                <Select
                  value={filters.rating?.toString() || ""}
                  onValueChange={(value) => updateFilter('rating', value ? parseInt(value) : undefined)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1+ stars</SelectItem>
                    <SelectItem value="2">2+ stars</SelectItem>
                    <SelectItem value="3">3+ stars</SelectItem>
                    <SelectItem value="4">4+ stars</SelectItem>
                    <SelectItem value="5">5 stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Min Price */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Min Price (£)</Label>
                  {filters.minPrice && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateFilter('minPrice', undefined)}
                      className="h-auto p-1 text-xs"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice || ''}
                  onChange={(e) => updateFilter('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                  min="0"
                  step="0.01"
                  className="w-full"
                />
              </div>

              {/* Max Price */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Max Price (£)</Label>
                  {filters.maxPrice && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateFilter('maxPrice', undefined)}
                      className="h-auto p-1 text-xs"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                <Input
                  type="number"
                  placeholder="100"
                  value={filters.maxPrice || ''}
                  onChange={(e) => updateFilter('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                  min="0"
                  step="0.01"
                  className="w-full"
                />
              </div>

              {/* Stock Filter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Stock Status</Label>
                  {filters.inStock && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateFilter('inStock', undefined)}
                      className="h-auto p-1 text-xs"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={filters.inStock === true}
                    onCheckedChange={(checked) => updateFilter('inStock', checked ? true : undefined)}
                  />
                  <Label className="text-sm">In Stock Only</Label>
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="flex justify-center sm:justify-end pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="flex items-center space-x-1"
                >
                  <X className="w-4 h-4" />
                  <span>Clear All Filters</span>
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}