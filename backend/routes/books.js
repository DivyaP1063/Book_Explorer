const express = require('express');
const { getBooks, getBookById, refreshBooks, getStats } = require('../controllers/bookController');

const router = express.Router();

// GET /api/books - Get paginated books with filters
router.get('/', getBooks);

// GET /api/books/stats - Get book statistics
router.get('/stats', getStats);

// GET /api/books/:id - Get single book by ID
router.get('/:id', getBookById);

// POST /api/books/refresh - Trigger scraping refresh
router.post('/refresh', refreshBooks);

module.exports = router;