const Book = require("../models/Book");

const getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Search functionality
    const search = req.query.search;
    let query = {};

    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
        ],
      };
    }

    const books = await Book.find(query)
      .sort({ scrapedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Book.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        books: books,
        pagination: {
          currentPage: page,
          totalPages,
          totalBooks: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching books",
      error: error.message,
    });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.json({
      success: true,
      data: book,
    });
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching book",
      error: error.message,
    });
  }
};

const refreshBooks = async (req, res) => {
  try {
    // Check if we're in production (Render) or development
    const isProduction = process.env.NODE_ENV === "production";

    if (isProduction) {
      // In production, manual refresh is limited - suggest GitHub Actions
      return res.json({
        success: false,
        message:
          "Manual refresh is not available in production due to dependency constraints.",
        suggestion:
          "Data is automatically updated daily via GitHub Actions. For immediate updates, trigger the GitHub Actions workflow manually from your repository.",
        githubActions:
          "Go to your GitHub repo → Actions → Book Scraper → Run workflow",
      });
    }

    // For development, try to run scraper
    const path = require("path");
    const scraperPath = path.join(__dirname, "../../scraper");

    // Change to scraper directory and run
    const { spawn } = require("child_process");

    const scraperProcess = spawn("node", ["runScraper.js"], {
      cwd: scraperPath,
      stdio: "pipe",
    });

    let output = "";
    let errorOutput = "";

    scraperProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    scraperProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    scraperProcess.on("close", (code) => {
      if (!res.headersSent) {
        if (code === 0) {
          res.json({
            success: true,
            message: "Books refreshed successfully",
            output: output,
          });
        } else {
          res.status(500).json({
            success: false,
            message: "Error refreshing books",
            error: errorOutput || "Scraper process failed",
          });
        }
      }
    });

    // Set timeout to prevent hanging
    setTimeout(() => {
      scraperProcess.kill();
      if (!res.headersSent) {
        res.status(408).json({
          success: false,
          message: "Scraper timeout - process took too long",
        });
      }
    }, 60000); // 60 second timeout
  } catch (error) {
    console.error("Error refreshing books:", error);
    res.status(500).json({
      success: false,
      message: "Error refreshing books",
      error: error.message,
    });
  }
};

const getStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const categories = await Book.distinct("category");
    const latestBook = await Book.findOne().sort({ scrapedAt: -1 });

    // Get books by rating distribution
    const ratingStats = await Book.aggregate([
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get category distribution
    const categoryStats = await Book.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      success: true,
      data: {
        totalBooks,
        totalCategories: categories.length,
        latestScrape: latestBook?.scrapedAt,
        ratingDistribution: ratingStats,
        topCategories: categoryStats,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching stats",
      error: error.message,
    });
  }
};

module.exports = {
  getBooks,
  getBookById,
  refreshBooks,
  getStats,
};
