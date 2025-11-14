# Airtable React App

A React TypeScript application that displays data from all tables in an Airtable base, with detail pages for each record and automatic linking between related records.

## Features

- 📊 Display all tables from your Airtable base
- 📝 View all records in each table
- 🔍 Detailed view for individual records
- 🔗 Automatic linking between related records (Airtable linked records become clickable links)
- ⚡ Built with React and TypeScript
- 🎨 Clean, responsive UI

## Setup

Install dependencies:

```bash
npm install
```

## Running the App

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── components/
│   ├── TableList.tsx       # Home page showing all tables
│   ├── TableView.tsx       # List of records in a table
│   └── RecordDetail.tsx    # Detailed view of a single record
├── services/
│   └── airtable.ts         # Airtable API service
├── App.tsx                 # Main app component with routing
├── App.css                 # Styles
└── index.tsx              # Entry point
```

## How It Works

1. **Tables View**: The home page displays all configured tables with record counts
2. **Records View**: Click a table to see all its records with preview of key fields
3. **Detail View**: Click a record to see all fields in detail
4. **Linked Records**: Any Airtable linked record fields automatically become clickable links that navigate to the linked record's detail page

## Technologies Used

- React 18
- TypeScript
- React Router v6
- Airtable API
- Create React App

## Notes

- The Airtable JavaScript SDK doesn't provide a way to automatically discover table names, so you'll need to manually configure them in the service
- Linked records are automatically detected and rendered as clickable links
- The app uses Airtable's API rate limits, so large bases may take time to load initially

## Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (one-way operation)

## License

MIT
