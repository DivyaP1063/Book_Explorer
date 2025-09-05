# Book Scraper

This directory contains the web scraping functionality for the Book Explorer application.

## Features

- Scrapes book data from [Books to Scrape](https://books.toscrape.com/)
- Extracts: Title, Price, Stock Availability, Rating, Detail Page URL, Thumbnail URL
- Navigates through all pages automatically
- Stores data in MongoDB with proper indexing
- Handles errors gracefully

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Make sure MongoDB is running and the connection string is set in the root `.env` file

3. Run the scraper:
   ```bash
   npm start
   ```

## Files

- `bookScraper.js` - Main scraper class with Selenium WebDriver logic
- `runScraper.js` - Script to execute the scraper
- `package.json` - Dependencies and scripts

## Requirements

- Chrome browser (for Selenium WebDriver)
- MongoDB connection
- Node.js v18+