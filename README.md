# Wellness Session Platform

A comprehensive platform for creating, managing, and sharing wellness sessions. This platform enables users to create interactive wellness content with auto-save functionality and real-time updates.

## Project Overview

The Wellness Session Platform is split into two main components:

```
Wellness-Session-Platform/
├── backend/           # Node.js + Express API
└── frontend/         # React + TypeScript UI
```

## Features

- 🔐 **User Authentication**
  - Secure login and registration
  - JWT-based authentication
  - Session management

- 📝 **Session Management**
  - Create and edit wellness sessions
  - Auto-save functionality (every 5 seconds)
  - Draft and published states
  - Tag-based organization

- 🔄 **Real-time Updates**
  - Automatic content saving
  - Inactivity detection (30-second timeout)
  - Draft recovery system

- 👥 **User Experience**
  - Intuitive interface
  - Responsive design
  - Progress tracking
  - Session history

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

### Frontend
- React
- TypeScript
- Vite
- CSS Modules

## Getting Started

1. **Clone the Repository**
   ```bash
   git clone https://github.com/LokeshLenka/Wellness-Session-Platform.git
   cd Wellness-Session-Platform
   ```

2. **Set Up Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure your .env file
   npm run dev
   ```

3. **Set Up Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Configure your .env file
   npm run dev
   ```

## Development

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Environment Setup
1. Backend environment variables (.env):
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/wellness-platform
   JWT_SECRET=your-secret-key
   JWT_REFRESH_SECRET=your-refresh-secret
   ```

2. Frontend environment variables (.env):
   ```
   VITE_API_URL=http://localhost:5000
   ```

## Project Structure

```
Wellness-Session-Platform/
├── backend/
│   ├── config/         # Configuration files
│   ├── middleware/     # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   └── index.js        # Entry point
│
└── frontend/
    ├── public/         # Static files
    └── src/
        ├── assets/     # Images, fonts, etc.
        ├── components/ # React components
        ├── hooks/      # Custom hooks
        ├── pages/      # Page components
        ├── services/   # API services
        └── utils/      # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Scripts

### Backend
```bash
npm run dev      # Start development server
npm start        # Start production server
npm test        # Run tests
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Deployment

### Backend
1. Set up MongoDB database
2. Configure environment variables
3. Build and deploy Node.js application
4. Set up reverse proxy (nginx recommended)

### Frontend
1. Build the frontend application
2. Deploy static files to web server
3. Configure CORS and API endpoints

