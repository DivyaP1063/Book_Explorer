# Frontend - Book Explorer

This directory contains the Next.js frontend application for the Book Explorer.

## Features

- Modern React application built with Next.js 13
- TypeScript for type safety
- Tailwind CSS for styling
- shadcn/ui component library
- Responsive design for all devices
- Advanced search and filtering
- Paginated book browsing
- Detailed book view modal

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at http://localhost:3000

## Project Structure

```
frontend/
├── app/
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── BookCard.tsx       # Individual book card
│   ├── BookDetail.tsx     # Book detail modal
│   ├── BookFilters.tsx    # Search and filter controls
│   ├── BookGrid.tsx       # Book grid layout
│   ├── Header.tsx         # Application header
│   └── Pagination.tsx     # Pagination controls
├── lib/
│   ├── api.ts             # API client functions
│   └── utils.ts           # Common utilities
├── types/
│   └── book.ts            # TypeScript type definitions
└── hooks/
    └── use-toast.ts       # Toast notification hook
```

## Environment Variables

The frontend expects the backend API to be running on `http://localhost:5000` in development.

## Building for Production

```bash
npm run build
npm start
```