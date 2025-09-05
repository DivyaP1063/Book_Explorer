const cron = require('node-cron');
const BookScraper = require('../scraper/bookScraper');

// Run scraper every day at 3 AM
const scheduleBookScraping = () => {
  cron.schedule('0 3 * * *', async () => {
    console.log('Starting scheduled book scraping...');
    try {
      const scraper = new BookScraper();
      await scraper.scrapeAllBooks();
      console.log('Scheduled scraping completed successfully');
    } catch (error) {
      console.error('Scheduled scraping failed:', error);
    }
  }, {
    timezone: "UTC"
  });
  
  console.log('Book scraping cron job scheduled for 3:00 AM UTC daily');
};

module.exports = { scheduleBookScraping };