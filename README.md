# Book Explorer

A full-stack web application that scrapes book data from [Books to Scrape](https://books.toscrape.com/), stores it in MongoDB, and provides a beautiful interface for browsing and searching books.

## 🚀 Quick Start

1. **Setup**: `npm run install:all`
2. **Configure**: Copy `.env.example` to `.env` and add your MongoDB URI
3. **Run Everything**: `npm run dev` (starts backend, frontend, and scraper watcher)
4. **Visit**: http://localhost:3000

**Note**: The scraper will automatically populate the database after 10 seconds, then run hourly.

## 🚀 Features

- **Automated Web Scraping**: Selenium-based scraper that extracts book data from all pages
- **RESTful API**: Express.js backend with pagination, search, and filtering
- **Modern Frontend**: Next.js with TypeScript, Tailwind CSS, and shadcn/ui components
- **Database Storage**: MongoDB for efficient data storage and querying
- **Automatic Data Refresh**: Scraper watcher runs initial scrape + hourly updates
- **Advanced Search & Filters**: Search by title, filter by price range, rating, and stock status
- **Individual Filter Clear**: Clear specific filters with dedicated buttons
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Real-time Statistics**: Book stats API for dashboard insights
- **Manual Refresh**: Force data refresh via API endpoint
- **Error Handling**: Comprehensive error handling across all layers

## 📁 Project Structure

```
book-explorer/
├── scraper/               # Web scraping functionality
│   ├── bookScraper.js    # Main scraper class with Selenium
│   ├── runScraper.js     # Scraper execution script
│   ├── package.json      # Scraper dependencies
│   └── README.md         # Scraper documentation
├── backend/               # Express.js API server
│   ├── config/           # Database configuration
│   ├── controllers/      # API controllers (books, stats)
│   ├── models/           # MongoDB models (Book schema)
│   ├── routes/           # API routes
│   ├── jobs/             # Local cron jobs (development)
│   ├── scripts/          # Utility scripts (scraper watcher)
│   ├── server.js         # Main server file
│   ├── package.json      # Backend dependencies
│   └── README.md         # Backend documentation
├── frontend/              # Next.js React application
│   ├── app/              # Next.js app directory (pages)
│   ├── components/       # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── BookCard.tsx  # Individual book display
│   │   ├── BookFilters.tsx # Search and filter component
│   │   ├── BookGrid.tsx  # Books grid layout
│   │   ├── Header.tsx    # App header with stats
│   │   └── Pagination.tsx # Pagination component
│   ├── lib/              # Utility functions (API client)
│   ├── types/            # TypeScript type definitions
│   ├── hooks/            # Custom React hooks
│   ├── package.json      # Frontend dependencies
│   └── README.md         # Frontend documentation
├── .github/              # GitHub configuration
│   └── workflows/        # GitHub Actions workflows
│       └── scraper.yml   # Automated scraping workflow (production)
├── database/              # Database schema & documentation
│   └── schema.js         # MongoDB schema definition with indexes
├── .env.example          # Environment variables template
├── FLOW.md               # Complete application flow documentation
└── README.md             # This file
```

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Chrome browser (for Selenium WebDriver)

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/DivyaP1063/Book_Explorer.git
   cd book-explorer
   ```

2. **Install all dependencies**

   ```bash
   npm run install:all
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env
   ```

   Then edit `.env` and add your MongoDB connection string:

   ```
   MONGODB_URI=your_mongodb_connection_string_here
   ```

4. **Frontend Environment Setup**
   ```bash
   cd frontend
   cp .env.example .env.local
   ```
   Edit `.env.local` and set:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

## 🚀 Running the Application

### Quick Start (Recommended)

```bash
npm run dev
```

This starts the backend server (port 5000), frontend (port 3000), and scraper watcher concurrently. The scraper will automatically run after 10 seconds and then hourly.

### Alternative Options

**Start without scraper watcher:**

```bash
npm run dev:basic
```

**Individual Services:**

**Start Backend Server:**

```bash
npm run backend:dev
```

**Start Frontend:**

```bash
npm run frontend:dev
```

**Run Scraper Once:**

```bash
npm run scraper
```

**Run Scraper Watcher (periodic scraping):**

```bash
npm run scraper:watch
```

## 📊 Initial Data Setup

When you run `npm run dev`, the database will be automatically populated:

- The scraper watcher starts automatically
- After 10 seconds, it scrapes all books from books.toscrape.com
- Data is stored in your MongoDB database
- Scraping repeats every hour to keep data fresh

**Manual scraping** (if needed):

```bash
npm run scraper
```

## 🔧 API Endpoints

### Books

- `GET /api/books` - Get paginated books with optional filters
- `GET /api/books/stats` - Get book statistics
- `GET /api/books/:id` - Get single book by ID
- `POST /api/books/refresh` - Trigger manual scraping refresh

### Example API Usage

```bash
# Get all books
curl http://localhost:5000/api/books

# Search for books
curl "http://localhost:5000/api/books?search=python"

# Filter by rating and stock
curl "http://localhost:5000/api/books?rating=4&inStock=true"

# Price range filter
curl "http://localhost:5000/api/books?minPrice=10&maxPrice=30"
```

## 🗄️ Database Schema

### Book Model

```javascript
{
  title: String,           // Book title
  price: Number,           // Numeric price value
  priceText: String,       // Original price text (e.g., "£12.99")
  availability: String,    // Availability text
  inStock: Boolean,        // Stock status
  rating: Number,          // Rating (1-5)
  ratingText: String,      // Rating text (e.g., "Three")
  detailPageUrl: String,   // URL to book detail page
  thumbnailUrl: String,    // URL to book thumbnail
  scrapedAt: Date,         // When the data was scraped
  createdAt: Date,         // When record was created
  updatedAt: Date          // When record was last updated
}
```

### Indexes

- Text index on `title` for search functionality
- Single indexes on `price`, `rating`, `inStock`, `scrapedAt`
- Compound indexes for common filter combinations

**Full schema documentation**: See [database/schema.js](./database/schema.js)

## Documentation

- **[FLOW.md](./FLOW.md)**: Complete application flow and architecture documentation
- **[database/schema.js](./database/schema.js)**: Detailed MongoDB schema with examples
- **Backend README**: `backend/README.md` - API documentation
- **Frontend README**: `frontend/README.md` - Component documentation
- **Scraper README**: `scraper/README.md` - Scraping process documentation

## Configuration

### Environment Variables

**Root `.env` file:**

```bash
MONGODB_URI=your_mongodb_connection_string_here
NODE_ENV=development
PORT=5000
```

**Frontend `.env.local` file:**

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Scraper Configuration

- **Development**: Scraper watcher runs every hour via `scripts/scraperWatcher.js`
- **Production**: GitHub Actions workflow runs daily at 3:00 AM UTC via `.github/workflows/scraper.yml`
- **Data Strategy**: Complete database replacement on each scrape (no duplicates)
- **Free Automation**: Uses GitHub Actions for 100% free scheduled scraping

### Available Scripts

| Command                 | Description                                               |
| ----------------------- | --------------------------------------------------------- |
| `npm run dev`           | Start all services (backend + frontend + scraper watcher) |
| `npm run dev:basic`     | Start only backend + frontend                             |
| `npm run setup`         | Install dependencies + run initial scrape                 |
| `npm run scraper`       | Run scraper once                                          |
| `npm run scraper:watch` | Start scraper watcher (hourly)                            |
| `npm run build`         | Build frontend for production                             |
| `npm run start`         | Start production servers                                  |

## 🐛 Troubleshooting

### Common Issues

1. **Selenium WebDriver Issues**

   - Make sure Chrome browser is installed
   - On Linux servers, install additional dependencies for headless Chrome
   - Check Chrome version compatibility with selenium-webdriver

2. **MongoDB Connection Issues**

   - Verify your MongoDB URI in the `.env` file
   - Ensure MongoDB service is running (local) or accessible (cloud)
   - Check network connectivity and firewall settings
   - For MongoDB Atlas, ensure IP whitelist includes your address

3. **API Connection Issues**

   - Make sure the backend server is running on port 5000
   - Check if frontend `.env.local` has correct `NEXT_PUBLIC_API_URL`
   - Verify CORS settings if accessing from different origins
   - Check console for network errors

4. **Port Conflicts**

   - Backend uses port 5000, frontend uses port 3000
   - Change ports in package.json scripts if needed
   - Kill existing processes: `npx kill-port 5000` or `npx kill-port 3000`

5. **Filter/Select Component Errors**

   - Ensure no `SelectItem` components have empty string values
   - Check Radix UI component compatibility
   - Clear browser cache if components behave unexpectedly

6. **Data Issues**
   - If books don't appear, check MongoDB connection and scraper logs
   - Manually run `npm run scraper` to populate database
   - Check console for API errors or network issues

## 📱 Usage

### Getting Started

1. **Run Setup**: `npm run setup` (first time only)
2. **Start Application**: `npm run dev`
3. **Wait for Scraper**: Initial data loads after 10 seconds
4. **Browse**: Visit http://localhost:3000

### Using the Interface

1. **Search Books**: Type in the search box and click "Search"
2. **Apply Filters**: Click "Show Filters" to access advanced options
   - **Minimum Rating**: Select 1-5 stars minimum
   - **Price Range**: Set min/max price in pounds
   - **Stock Status**: Toggle "In Stock Only"
3. **Clear Filters**: Use individual "×" buttons or "Clear Filters"
4. **View Details**: Click any book card for detailed information
5. **Pagination**: Navigate through pages using pagination controls
6. **Refresh Data**: Use refresh button in header to update book data

### API Usage

- **Frontend**: Automatically handles all API calls
- **Direct API**: Access at `http://localhost:5000/api/books`
- **Manual Refresh**: POST to `/api/books/refresh`
- **Statistics**: GET `/api/books/stats` for database insights

### Data Management

- **Automatic**: Scraper runs hourly to keep data fresh
- **Manual**: Use refresh button or API endpoint
- **No Duplicates**: Each scrape replaces all data completely

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
