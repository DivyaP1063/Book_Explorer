const BookScraper = require('./bookScraper');
require('dotenv').config({ path: '../.env' });

const runScraper = async () => {
  try {
    console.log('Initializing book scraper...');
    const scraper = new BookScraper();
    
    await scraper.scrapeAllBooks();
    
    console.log('Scraping completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Scraping failed:', error);
    process.exit(1);
  }
};

runScraper();