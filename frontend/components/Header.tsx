'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookAPI } from '@/lib/api';
import { BookStats } from '@/types/book';
import { BookOpen, RefreshCw, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function Header() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState<BookStats | null>(null);
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      const response = await BookAPI.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await BookAPI.refreshBooks();
      if (response.success) {
        toast({
          title: "Refresh Successful",
          description: `Updated ${response.totalBooks} books from the source`,
        });
        await fetchStats(); // Refresh stats after successful scraping
      }
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Could not refresh books. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600 flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">Book Explorer</h1>
              <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                Discover amazing books from our curated collection
              </p>
            </div>
          </div>

          {/* Stats and Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {/* Stats */}
            {stats && (
              <div className="hidden lg:flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-gray-500" />
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">{stats.totalBooks} books</Badge>
                    <Badge variant="secondary" className="text-xs">{stats.inStockBooks} in stock</Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Stats */}
            {stats && (
              <div className="flex lg:hidden items-center">
                <Badge variant="outline" className="text-xs">{stats.totalBooks}</Badge>
              </div>
            )}

            {/* Refresh Button */}
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
              className="flex items-center space-x-1 sm:space-x-2"
            >
              <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline text-xs sm:text-sm">
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}