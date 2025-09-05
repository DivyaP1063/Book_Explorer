const Book = require('../models/Book');

const getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    
    // Search by title
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Filter by rating
    if (req.query.rating) {
      filter.rating = { $gte: parseInt(req.query.rating) };
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) {
        filter.price.$gte = parseFloat(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        filter.price.$lte = parseFloat(req.query.maxPrice);
      }
    }

    // Filter by stock availability
    if (req.query.inStock !== undefined) {
      filter.inStock = req.query.inStock === 'true';
    }

    const books = await Book.find(filter)
      .sort({ scrapedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Book.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        books,
        pagination: {
          currentPage: page,
          totalPages,
          totalBooks: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching books',
      error: error.message
    });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching book',
      error: error.message
    });
  }
};

const refreshBooks = async (req, res) => {
  try {
    console.log('📥 Refresh books request received');
    
    const BookScraper = require('../../scraper/bookScraper');
    const scraper = new BookScraper();
    
    console.log('🔄 Starting book refresh...');
    await scraper.scrapeAllBooks();
    
    const totalBooks = await Book.countDocuments();
    
    console.log('✅ Book refresh completed, total books:', totalBooks);
    
    res.json({
      success: true,
      message: 'Books refreshed successfully',
      totalBooks
    });
  } catch (error) {
    console.error('❌ Error refreshing books:', error);
    res.status(500).json({
      success: false,
      message: 'Error refreshing books',
      error: error.message
    });
  }
};

const getStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const inStockBooks = await Book.countDocuments({ inStock: true });
    const outOfStockBooks = await Book.countDocuments({ inStock: false });
    
    const ratingStats = await Book.aggregate([
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const priceStats = await Book.aggregate([
      {
        $group: {
          _id: null,
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalBooks,
        inStockBooks,
        outOfStockBooks,
        ratingDistribution: ratingStats,
        priceStats: priceStats[0] || {}
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

module.exports = {
  getBooks,
  getBookById,
  refreshBooks,
  getStats
};