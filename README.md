# Internship and Job Application Tracker with Skill Analytics

A full-stack web application to help users track their job/internship applications, analyze required skills, and identify skill gaps. Built with React.js, Node.js, Express, and MongoDB.

## Features

- **Application Management**
  - Track job/internship applications
  - Add, edit, and delete applications
  - Monitor application status
  - Store company and position details
  - Record contact information and notes

- **Skill Analytics**
  - Track your current skills and proficiency levels
  - Identify skill gaps based on job requirements
  - Get recommendations for skill improvement
  - Visualize skill requirements across applications

- **Dashboard**
  - Overview of application statistics
  - Visual representation of application status
  - Quick access to recent applications
  - Skill gap analysis summary

## Tech Stack

### Frontend
- React.js
- Material-UI for UI components
- React Router for navigation
- Axios for API requests
- Chart.js for data visualization

### Backend
- Node.js
- Express.js
- MongoDB
- JWT for authentication
- Bcrypt for password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/application-tracker.git
cd application-tracker
```

2. Install backend dependencies:
```bash
cd server
npm install
```

3. Install frontend dependencies:
```bash
cd ../client
npm install
```

4. Create a `.env` file in the server directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/application-tracker
JWT_SECRET=your_jwt_secret
```

## Running the Application

1. Start the backend server:
```bash
cd server
npm start
```

2. Start the frontend development server:
```bash
cd client
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
application-tracker/
├── client/                 # Frontend React application
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── App.js        # Main application component
│   │   └── index.js      # Entry point
│   └── package.json
│
├── server/                # Backend Node.js application
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── server.js         # Server entry point
│   └── package.json
│
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Applications
- `GET /api/applications` - Get all applications
- `POST /api/applications` - Create new application
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application
- `GET /api/applications/stats` - Get application statistics

### Skills
- `GET /api/skills` - Get user's skills
- `POST /api/skills` - Add/update skill
- `GET /api/skills/gap-analysis` - Get skill gap analysis

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Material-UI for the UI components
- MongoDB for the database
- React community for the amazing ecosystem 