# 📋 Book Explorer - Application Flow Documentation

This document provides a comprehensive overview of how the Book Explorer application works, detailing the flow of data, processes, and interactions between all components.

## 🏗️ High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FRONTEND      │    │    BACKEND      │    │    SCRAPER      │
│   (Next.js)     │◄──►│   (Express.js)  │◄──►│   (Selenium)    │
│   Port: 3000    │    │   Port: 5000    │    │ GitHub Actions  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   USER BROWSER  │    │    MONGODB      │    │ books.toscrape  │
│   Interface     │    │    Database     │    │   Target Site   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Application Startup Flow

### 1. Running `npm run dev`

When you execute `npm run dev`, the following happens:

```bash
npm run dev
├── concurrently starts 3 processes:
│   ├── npm run backend:dev    # Starts Express server
│   ├── npm run frontend:dev   # Starts Next.js dev server  
│   └── npm run scraper:watch  # Starts scraper watcher
```

### 2. Backend Initialization (`backend/server.js`)

```javascript
// 1. Load environment variables
require('dotenv').config({ path: '../.env' });

// 2. Connect to MongoDB
connectDB();

// 3. Setup middleware (CORS, JSON parsing)
app.use(cors());
app.use(express.json());

// 4. Register API routes
app.use('/api/books', bookRoutes);

// 5. Start server on port 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Backend Flow:**
1. **Environment Setup**: Loads `.env` file for MongoDB URI
2. **Database Connection**: Connects to MongoDB using Mongoose
3. **Middleware Registration**: Sets up CORS, JSON parsing, URL encoding
4. **Route Registration**: Mounts book routes at `/api/books`
5. **Error Handling**: Global error handler and 404 handler
6. **Server Start**: Listens on port 5000

### 3. Frontend Initialization (`frontend/app/page.tsx`)

```javascript
// 1. Component mounts
useEffect(() => {
  fetchBooks(1, {});  // Fetch initial books
}, []);

// 2. API call to backend
const fetchBooks = async () => {
  const response = await BookAPI.getBooks(page, 20, filters);
  setBooks(response.data.books);
};
```

**Frontend Flow:**
1. **Next.js App Start**: Starts development server on port 3000
2. **Component Mount**: Main page component initializes
3. **Initial API Call**: Fetches first page of books from backend
4. **State Management**: Sets up React state for books, filters, pagination
5. **UI Rendering**: Displays loading state, then book grid

### 4. Scraper Watcher Initialization (`backend/scripts/scraperWatcher.js`)

```javascript
// 1. Wait 10 seconds for backend to start
await wait(10);

// 2. Run initial scrape
await runScraper();

// 3. Set up hourly scraping loop
while (true) {
  await wait(3600); // 1 hour
  await runScraper();
}
```

**Scraper Watcher Flow:**
1. **Startup Delay**: Waits 10 seconds for backend to be ready
2. **Initial Scrape**: Runs scraper to populate database
3. **Periodic Scraping**: Continues scraping every hour
4. **Error Handling**: Graceful error handling and recovery

## 🕷️ Web Scraping Flow

### Scraper Process (`scraper/bookScraper.js`)

```javascript
class BookScraper {
  async scrapeAllBooks() {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    
    // 2. Initialize Selenium WebDriver
    await this.initDriver();
    
    // 3. Scrape all pages
    let currentPage = 1;
    while (hasNextPage) {
      const books = await this.scrapeCurrentPage();
      allBooks.push(...books);
      currentPage++;
    }
    
    // 4. Save to database
    await this.saveBooks(allBooks);
  }
}
```

### Detailed Scraping Steps:

1. **WebDriver Setup**:
   ```javascript
   const options = new chrome.Options();
   options.addArguments('--headless');  // Run in background
   options.addArguments('--no-sandbox');
   this.driver = await new Builder().forBrowser('chrome').build();
   ```

2. **Page Navigation**:
   ```javascript
   const pageUrl = currentPage === 1 
     ? `${this.baseUrl}/index.html`
     : `${this.baseUrl}/catalogue/page-${currentPage}.html`;
   await this.driver.get(pageUrl);
   ```

3. **Data Extraction**:
   ```javascript
   // Find all book containers
   const bookElements = await this.driver.findElements(By.css('.product_pod'));
   
   for (let bookElement of bookElements) {
     // Extract title
     const title = await bookElement.findElement(By.css('h3 a')).getAttribute('title');
     
     // Extract price
     const priceText = await bookElement.findElement(By.css('.price_color')).getText();
     const price = parseFloat(priceText.replace('£', ''));
     
     // Extract rating
     const ratingElement = await bookElement.findElement(By.css('[class*="star-rating"]'));
     const ratingClass = await ratingElement.getAttribute('class');
     
     // Extract availability
     const availability = await bookElement.findElement(By.css('.availability')).getText();
     
     // Extract image URL
     const imgElement = await bookElement.findElement(By.css('img'));
     const thumbnailUrl = await imgElement.getAttribute('src');
   }
   ```

4. **Data Processing**:
   ```javascript
   // Convert rating text to number
   const ratingMap = { 'One': 1, 'Two': 2, 'Three': 3, 'Four': 4, 'Five': 5 };
   const rating = ratingMap[ratingText] || 0;
   
   // Determine stock status
   const inStock = availability.toLowerCase().includes('in stock');
   
   // Resolve relative image URLs
   const thumbnailUrl = new URL(rawThumbnailUrl, this.baseUrl).href;
   ```

5. **Database Storage**:
   ```javascript
   // Use upsert to avoid duplicates
   await Book.findOneAndUpdate(
     { detailPageUrl: book.detailPageUrl },
     { ...book, scrapedAt: new Date() },
     { upsert: true, new: true }
   );
   ```

## 🔄 Automated Scraping Flow

### Three Scraping Mechanisms:

#### 1. Development Scraper Watcher (`scripts/scraperWatcher.js`)
- **Purpose**: For development environment
- **Schedule**: Initial run + every hour
- **Process**:
  ```javascript
  // Spawns new process for each scrape
  const scraperProcess = spawn('node', ['scripts/runScraper.js']);
  
  // Monitors process completion
  scraperProcess.on('close', (code) => {
    if (code === 0) console.log('✅ Scraper completed');
  });
  ```

#### 2. GitHub Actions Workflow (`.github/workflows/scraper.yml`)
- **Purpose**: For production environment (FREE automation)
- **Schedule**: Daily at 3:00 AM UTC
- **Process**:
  ```yaml
  name: Daily Book Scraping
  on:
    schedule:
      - cron: '0 3 * * *'  # Daily at 3 AM UTC
    workflow_dispatch:     # Manual trigger option
  
  jobs:
    scrape:
      runs-on: ubuntu-latest
      steps:
        - name: Checkout code
          uses: actions/checkout@v4
        
        - name: Setup Node.js
          uses: actions/setup-node@v4
          
        - name: Install dependencies
          run: npm install
          
        - name: Run scraper
          run: node scraper/runScraper.js
          env:
            MONGODB_URI: ${{ secrets.MONGODB_URI }}
  ```

#### 3. Manual Refresh Endpoint (`POST /api/books/refresh`)
- **Purpose**: On-demand scraping via API
- **Trigger**: User clicks refresh button or API call
- **Process**:
  ```javascript
  // Trigger manual scraping
  const BookScraper = require('../../scraper/bookScraper');
  const scraper = new BookScraper();
  await scraper.scrapeAllBooks();
  ```

### Cron Schedule Explanation:
```
'0 3 * * *'
 │ │ │ │ │
 │ │ │ │ └── Day of week (0-7, Sunday = 0 or 7)
 │ │ │ └──── Month (1-12)
 │ │ └────── Day of month (1-31)
 │ └──────── Hour (0-23)
 └────────── Minute (0-59)
```

### GitHub Actions Flow:
1. **Schedule Trigger**: GitHub automatically triggers workflow daily
2. **Environment Setup**: Ubuntu runner with Node.js and Chrome
3. **Code Checkout**: Downloads latest code from repository
4. **Dependencies**: Installs npm packages including Selenium
5. **Environment Variables**: Loads MongoDB URI from GitHub secrets
6. **Scraper Execution**: Runs scraper to update database
7. **Completion**: Workflow completes and logs results

## 🗄️ Database Flow

### MongoDB Schema (`backend/models/Book.js`)

```javascript
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
```

### Database Indexes:
```javascript
// Text search index for title searching
bookSchema.index({ title: 'text' });

// Single field indexes for filtering
bookSchema.index({ price: 1 });
bookSchema.index({ rating: 1 });
bookSchema.index({ inStock: 1 });
bookSchema.index({ scrapedAt: 1 });
```

### Data Flow:
1. **Scraper** → Extracts data → **MongoDB**
2. **Backend API** → Queries MongoDB → **Frontend**
3. **User Actions** → API requests → **Database queries**

## 🌐 Backend API Flow

### API Endpoints (`backend/routes/books.js`)

```javascript
router.get('/', getBooks);           // GET /api/books
router.get('/stats', getStats);      // GET /api/books/stats  
router.get('/:id', getBookById);     // GET /api/books/:id
router.post('/refresh', refreshBooks); // POST /api/books/refresh
```

### Request/Response Flow:

#### 1. Get Books (`GET /api/books`)
```javascript
// 1. Parse query parameters
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 20;

// 2. Build MongoDB filter
const filter = {};
if (req.query.search) filter.$text = { $search: req.query.search };
if (req.query.rating) filter.rating = { $gte: parseInt(req.query.rating) };

// 3. Execute database query
const books = await Book.find(filter)
  .sort({ scrapedAt: -1 })
  .skip((page - 1) * limit)
  .limit(limit);

// 4. Return paginated response
res.json({
  success: true,
  data: { books, pagination: {...} }
});
```

#### 2. Get Statistics (`GET /api/books/stats`)
```javascript
// Aggregation pipeline for statistics
const ratingStats = await Book.aggregate([
  { $group: { _id: '$rating', count: { $sum: 1 } } },
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
```

#### 3. Refresh Books (`POST /api/books/refresh`)
```javascript
// Trigger manual scraping
const BookScraper = require('../../scraper/bookScraper');
const scraper = new BookScraper();
await scraper.scrapeAllBooks();

// Return updated count
const totalBooks = await Book.countDocuments();
res.json({ success: true, totalBooks });
```

## 🖥️ Frontend Flow

### React Component Architecture

```
App (page.tsx)
├── Header
│   ├── Logo & Title
│   ├── Stats Display
│   └── Refresh Button
├── BookFilters
│   ├── Search Input
│   ├── Rating Filter
│   ├── Price Range
│   └── Stock Filter
├── BookGrid
│   └── BookCard[] (mapped from books array)
├── Pagination
│   ├── Previous/Next buttons
│   └── Page numbers
└── BookDetail (Modal)
    ├── Book Image
    ├── Title & Price
    ├── Rating & Stock
    └── Close Button
```

### State Management Flow:

```javascript
// 1. Initial state setup
const [books, setBooks] = useState<Book[]>([]);
const [loading, setLoading] = useState(true);
const [filters, setFilters] = useState<BookFiltersType>({});
const [currentPage, setCurrentPage] = useState(1);

// 2. Data fetching effect
useEffect(() => {
  fetchBooks(1, {});
}, []);

// 3. User interactions trigger state updates
const handleSearch = () => {
  setCurrentPage(1);
  fetchBooks(1, filters);  // New API call
};

const handlePageChange = (page: number) => {
  setCurrentPage(page);
  fetchBooks(page, filters);  // New API call
};
```

### API Integration (`frontend/lib/api.ts`)

```javascript
export class BookAPI {
  static async getBooks(page, limit, filters) {
    // 1. Build query parameters
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    // 2. Add filters to query
    if (filters.search) params.append('search', filters.search);
    if (filters.rating) params.append('rating', filters.rating.toString());
    
    // 3. Make HTTP request
    const response = await fetch(`${API_BASE_URL}/books?${params}`);
    
    // 4. Handle response
    if (!response.ok) throw new Error('Failed to fetch books');
    return response.json();
  }
}
```

## 🔄 Complete User Journey Flow

### Scenario: User searches for books

1. **User Action**: Types "python" in search box and clicks search
   ```javascript
   // Frontend: BookFilters component
   const handleSearchChange = (value) => {
     setFilters({ ...filters, search: value });
   };
   ```

2. **Frontend Processing**: Updates filters state and triggers API call
   ```javascript
   // Frontend: page.tsx
   const handleSearch = () => {
     setCurrentPage(1);
     fetchBooks(1, filters);  // API call with search term
   };
   ```

3. **API Request**: Frontend makes HTTP request to backend
   ```javascript
   // Frontend: api.ts
   const response = await fetch(`${API_BASE_URL}/books?search=python&page=1&limit=20`);
   ```

4. **Backend Processing**: Express server receives request
   ```javascript
   // Backend: bookController.js
   const filter = {};
   if (req.query.search) {
     filter.$text = { $search: req.query.search };  // MongoDB text search
   }
   ```

5. **Database Query**: MongoDB searches indexed title field
   ```javascript
   const books = await Book.find(filter)
     .sort({ scrapedAt: -1 })
     .skip(0)
     .limit(20);
   ```

6. **Response Chain**: Database → Backend → Frontend → User
   ```
   MongoDB → Express Controller → API Response → React State → UI Update
   ```

7. **UI Update**: React re-renders with filtered results
   ```javascript
   // Frontend: Component re-renders with new books array
   {books.map(book => <BookCard key={book._id} book={book} />)}
   ```

## 🕸️ Error Handling Flow

### Frontend Error Handling:
```javascript
try {
  const response = await BookAPI.getBooks(page, 20, filters);
  setBooks(response.data.books);
} catch (error) {
  toast({
    title: "Connection Error",
    description: "Could not connect to the server.",
    variant: "destructive",
  });
}
```

### Backend Error Handling:
```javascript
// Global error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});
```

### Scraper Error Handling:
```javascript
// Graceful error recovery
try {
  await runScraper();
} catch (error) {
  console.error('❌ Scraping failed, will retry in next cycle:', error.message);
  // Continue the loop instead of crashing
}
```

## 📊 Performance Considerations

### Database Optimization:
- **Indexes**: Text search, price, rating, stock status
- **Pagination**: Limit results per query
- **Lean Queries**: Return plain objects instead of Mongoose documents

### Frontend Optimization:
- **Lazy Loading**: Load components on demand
- **Debounced Search**: Prevent excessive API calls
- **Caching**: Browser caches API responses

### Scraper Optimization:
- **Headless Chrome**: Faster scraping without GUI
- **Batch Processing**: Process multiple books per page
- **Connection Reuse**: Keep database connection open

## 🔐 Security Measures

### Backend Security:
- **CORS**: Cross-origin request protection
- **Input Validation**: Sanitize query parameters
- **Error Sanitization**: Hide internal errors in production

### Database Security:
- **Connection String**: Stored in environment variables
- **Validation**: Mongoose schema validation
- **Indexing**: Prevent performance attacks

### Scraper Security:
- **Rate Limiting**: Respectful scraping intervals
- **Error Handling**: Graceful failure recovery
- **Resource Management**: Proper WebDriver cleanup

---

This flow documentation provides a complete understanding of how the Book Explorer application works from startup to user interaction, covering all major components and their interactions.
