# G3 Transport Management - Setup Guide

## System Requirements

### Prerequisites
- **Node.js**: Version 16.x or higher
- **npm**: Version 8.x or higher (comes with Node.js)
- **Operating System**: Windows, macOS, or Linux
- **Browser**: Chrome 60+, Firefox 60+, Safari 12+, or Edge 79+

## Quick Setup

### 1. Backend Setup
```bash
cd backend
npm install
npm run seed
npm start
```
The backend will run on `http://localhost:5001`

### 2. Frontend Setup (New Terminal)
```bash
cd frontend
npm install
npm start
```
The frontend will run on `http://localhost:3000`

## Detailed Installation

### Backend Dependencies
```bash
cd backend
npm install bcryptjs@^2.4.3 cors@^2.8.5 express@^4.18.2 sqlite3@^5.1.6
```

### Frontend Dependencies
```bash
cd frontend
npm install react@^18.2.0 react-dom@^18.2.0 react-scripts@5.0.1 tailwindcss@^3.3.3 chart.js@^4.3.3 react-chartjs-2@^5.2.0 axios@^1.4.0 lucide-react@^0.263.1 jspdf@^2.5.1 html2canvas@^1.4.1
```

## Database Initialization

The `npm run seed` command will:
- Create SQLite database (`database.sqlite`)
- Set up user accounts:
  - **Admin**: username: `admin`, password: `password123`
  - **Employee**: username: `employee`, password: `password123`
- Insert sample trip data

## Development Scripts

### Backend
- `npm start` - Start production server
- `npm run seed` - Initialize database with sample data

### Frontend
- `npm start` - Start development server with hot reload
- `npm run build` - Build for production

## Production Deployment

### Backend
1. Set environment variables for production
2. Use PM2 or similar process manager
3. Configure reverse proxy (nginx/Apache)

### Frontend
1. Run `npm run build`
2. Serve the `build` folder with a web server
3. Configure API endpoint for production backend

## Troubleshooting

### Common Issues
1. **Port conflicts**: Change ports in server.js (backend) or package.json (frontend)
2. **Database errors**: Delete `database.sqlite` and run `npm run seed` again
3. **Module not found**: Run `npm install` in the respective directory
4. **CORS errors**: Ensure backend is running on port 5001

### Support
- Check console logs for detailed error messages
- Ensure all dependencies are installed correctly
- Verify Node.js version compatibility
