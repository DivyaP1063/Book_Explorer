# Backend API Server

This directory contains the Express.js backend server for the Book Explorer application.

## Features

- RESTful API with Express.js
- MongoDB integration with Mongoose
- Pagination, search, and filtering
- Automated cron job for data refresh
- Comprehensive error handling

## API Endpoints

### Books
- `GET /api/books` - Get paginated books with optional filters
  - Query parameters:
    - `page` (number): Page number (default: 1)
    - `limit` (number): Items per page (default: 20)
    - `search` (string): Search by book title
    - `rating` (number): Minimum rating filter
    - `minPrice` (number): Minimum price filter
    - `maxPrice` (number): Maximum price filter
    - `inStock` (boolean): Filter by stock availability

- `GET /api/books/:id` - Get single book by ID
- `POST /api/books/refresh` - Trigger manual scraping refresh
- `GET /api/books/stats` - Get book statistics

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Make sure MongoDB is running and the connection string is set in the root `.env` file

3. Start the server:
   ```bash
   npm start
   ```

The server will run on port 5000 by default.

## Project Structure

```
backend/
├── config/
│   └── database.js        # MongoDB connection
├── controllers/
│   └── bookController.js  # API controllers
├── jobs/
│   └── scrapingCron.js    # Cron job setup
├── models/
│   └── Book.js            # MongoDB book model
├── routes/
│   └── books.js           # API routes
└── server.js              # Express server setup
```