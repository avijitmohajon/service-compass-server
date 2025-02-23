Service Compass Backend
This is the backend repository for Service Compass, a platform designed to allow users to review and interact with services listed by others.

Key Features
User authentication using JWT (JSON Web Tokens)
APIs for managing services (add, update, delete)
APIs for managing reviews (add, update, delete)
Data storage using MongoDB
Search and filter functionality for services
Responsive design
Secure configuration using environment variables
Deployment-ready with instructions and guidelines
Technologies Used
Node.js
Express.js
MongoDB
Mongoose
JSON Web Tokens (JWT)
Firebase (for authentication)
Getting Started
Clone the repository:
git clone <https://github.com/avijitmohajon/service-compass-server.git>
Navigate to the project directory:
cd service-compass-backend
Install dependencies:
npm install
Set up environment variables:
Create a .env file in the root directory.
Add your MongoDB connection string and Firebase credentials.

Deployment
Prepare for deployment:

Ensure all necessary environment variables are set in your hosting platform.
Build the production version of your client-side application and include it in the public folder.
Deploy to a hosting service:

Use a platform like Heroku, AWS, or Google Cloud Platform to deploy your backend.
Configure your hosting service to start your Node.js application.
Post-deployment checklist:

Verify that the server is running without any errors.
Test all API endpoints to ensure they are functioning correctly.
Check for any CORS or 404/504 errors and resolve them.
Ensure that the live link is working perfectly and that it is not showing errors.
Add your domain for authorization to Firebase if you use Netlify/Surge.
Verify that logged-in users are not redirected to login on reloading any private route.
API Endpoints
POST /api/users/register - Register a new user
POST /api/users/login - Login user and return JWT token
POST /api/services - Add a new service
GET /api/services - Get all services
GET /api/services/:id - Get a specific service by ID
PUT /api/services/:id - Update a service
DELETE /api/services/:id - Delete a service
POST /api/reviews - Add a review to a service
GET /api/reviews/:serviceId - Get all reviews for a service
PUT /api/reviews/:id - Update a review
DELETE /api/reviews/:id - Delete a review
