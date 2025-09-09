# G3 Transport Management - Full Stack Application

This is a complete transport automation system that converts trip sheet images into structured records, stores them, generates invoices, and provides business analytics.

## Project Structure

```
G3-Transport/
├── backend/        # Node.js, Express, SQLite
└── frontend/       # React
```

## Prerequisites

- Node.js and npm (or yarn) installed on your machine.

## Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Initialize the database:**
   This command will create the `database.sqlite` file and populate it with initial data, including an admin user.
   ```bash
   npm run seed
   ```
   - **Admin Login:** `username: admin`, `password: password123`
   - **Employee Login:** `username: employee`, `password: password123`

4. **Start the backend server:**
   ```bash
   npm start
   ```

   The backend API will now be running at `http://localhost:5001`. Keep this terminal open.

## Frontend Setup

1. **Open a new terminal.**
2. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the frontend application:**
   ```bash
   npm start
   ```

   The application will open in your browser at `http://localhost:3000`. You can now log in and use the system.

## Features

- **OCR Processing**: Upload handwritten bills and extract data automatically
- **Trip Management**: Create, edit, and delete trip records
- **Invoice Generation**: Generate professional PDF invoices
- **Business Analytics**: View comprehensive dashboards with insights
- **User Authentication**: Secure login with role-based access
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

### Backend
- Node.js
- Express.js
- SQLite3
- bcryptjs for password hashing
- CORS for cross-origin requests

### Frontend
- React 18
- Tailwind CSS
- Chart.js for analytics
- Lucide React for icons
- Axios for API calls
- jsPDF for PDF generation
- html2canvas for printing

## API Endpoints

- `POST /api/login` - User authentication
- `GET /api/trips` - Get all trips
- `POST /api/trips` - Create new trip
- `DELETE /api/trips/:id` - Delete trip

## License

All Rights Reserved - G3 Transport Management
