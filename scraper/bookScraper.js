const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

// MongoDB Book Model
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  priceText: { type: String, required: true },
  availability: { type: String, required: true },
  inStock: { type: Boolean, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  ratingText: { type: String, required: true },
  detailPageUrl: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  scrapedAt: { type: Date, default: Date.now }
}, { timestamps: true });

bookSchema.index({ title: 'text' });
bookSchema.index({ price: 1 });
bookSchema.index({ rating: 1 });
bookSchema.index({ inStock: 1 });
bookSchema.index({ scrapedAt: 1 });

const Book = mongoose.model('Book', bookSchema);

class BookScraper {
  constructor() {
    this.baseUrl = 'https://books.toscrape.com';
    this.driver = null;
  }

  async initDriver() {
    const options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    options.addArguments('--window-size=1920,1080');

    this.driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  }

  async scrapeAllBooks() {
    try {
      // Connect to MongoDB
      if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
      }

      await this.initDriver();
      console.log('Starting book scraping process...');

      let currentPage = 1;
      let hasNextPage = true;
      let allBooks = [];

      while (hasNextPage) {
        console.log(`Scraping page ${currentPage}...`);
        
        const pageUrl = currentPage === 1 
          ? `${this.baseUrl}/index.html`
          : `${this.baseUrl}/catalogue/page-${currentPage}.html`;

        await this.driver.get(pageUrl);
        await this.driver.wait(until.elementLocated(By.css('.product_pod')), 10000);

        const books = await this.scrapeCurrentPage();
        allBooks.push(...books);

        // Check if there's a next page
        try {
          const nextButton = await this.driver.findElement(By.css('.next a'));
          hasNextPage = await nextButton.isDisplayed();
          currentPage++;
        } catch (error) {
          hasNextPage = false;
        }
      }

      console.log(`Scraped ${allBooks.length} books total`);

      // Clear existing books and insert new ones
      await Book.deleteMany({});
      await Book.insertMany(allBooks);
      
      console.log('Books saved to database successfully');
      return allBooks;

    } catch (error) {
      console.error('Error during scraping:', error);
      throw error;
    } finally {
      if (this.driver) {
        await this.driver.quit();
      }
    }
  }

  async scrapeCurrentPage() {
    const bookElements = await this.driver.findElements(By.css('.product_pod'));
    const books = [];

    for (let bookElement of bookElements) {
      try {
        const book = await this.extractBookData(bookElement);
        books.push(book);
      } catch (error) {
        console.error('Error extracting book data:', error);
      }
    }

    return books;
  }

  async extractBookData(bookElement) {
    // Get title
    const titleElement = await bookElement.findElement(By.css('h3 a'));
    const title = await titleElement.getAttribute('title');

    // Get price
    const priceElement = await bookElement.findElement(By.css('.price_color'));
    const priceText = await priceElement.getText();
    const price = parseFloat(priceText.replace('£', ''));

    // Get availability
    const availabilityElement = await bookElement.findElement(By.css('.availability'));
    const availability = await availabilityElement.getText();
    const inStock = availability.includes('In stock');

    // Get rating
    const ratingElement = await bookElement.findElement(By.css('.star-rating'));
    const ratingClass = await ratingElement.getAttribute('class');
    const ratingText = ratingClass.split(' ')[1]; // e.g., "Three"
    const rating = this.convertRatingToNumber(ratingText);

    // Get detail page URL
    const detailLink = await bookElement.findElement(By.css('h3 a'));
    const detailPageUrl = await detailLink.getAttribute('href');
    const fullDetailUrl = this.resolveUrl(detailPageUrl);

    // Get thumbnail URL
    const thumbnailElement = await bookElement.findElement(By.css('.image_container img'));
    const thumbnailUrl = await thumbnailElement.getAttribute('src');
    const fullThumbnailUrl = this.resolveUrl(thumbnailUrl);

    return {
      title,
      price,
      priceText,
      availability: availability.trim(),
      inStock,
      rating,
      ratingText,
      detailPageUrl: fullDetailUrl,
      thumbnailUrl: fullThumbnailUrl
    };
  }

  convertRatingToNumber(ratingText) {
    const ratingMap = {
      'One': 1,
      'Two': 2,
      'Three': 3,
      'Four': 4,
      'Five': 5
    };
    return ratingMap[ratingText] || 0;
  }

  resolveUrl(relativeUrl) {
    if (relativeUrl.startsWith('http')) {
      return relativeUrl; // Already absolute
    }
    
    // Handle relative URLs like "../../../media/cache/..."
    if (relativeUrl.startsWith('../')) {
      // Remove leading ../ parts and construct proper URL
      const cleanPath = relativeUrl.replace(/\.\.\//g, '');
      return `${this.baseUrl}/${cleanPath}`;
    }
    
    // Handle other relative URLs
    if (relativeUrl.startsWith('/')) {
      return `${this.baseUrl}${relativeUrl}`;
    }
    
    return `${this.baseUrl}/${relativeUrl}`;
  }
}

module.exports = BookScraper;