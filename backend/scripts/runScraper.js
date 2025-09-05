const BookScraper = require('../../scraper/bookScraper');
require('dotenv').config({ path: '../../.env' });

const runScraper = async () => {
  console.log('Starting book scraper...');
  
  const scraper = new BookScraper();
  
  try {
    await scraper.scrapeAllBooks();
    console.log('✅ Scraping completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Scraping failed:', error);
    process.exit(1);
  }
};

// Run the scraper if this file is called directly
if (require.main === module) {
  runScraper();
}

module.exports = { runScraper };
