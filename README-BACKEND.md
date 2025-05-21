# MockItUp AI - Backend API

This is the backend API for the MockItUp AI application, built with Node.js, Express, and MongoDB. It provides RESTful API endpoints for template management, user authentication, and payment processing.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Template Management**: CRUD operations for templates with filtering, sorting, and pagination
- **Payment Processing**: Integration with Stripe and PayPal for subscription management
- **Security**: Helmet, CORS, rate limiting, and data sanitization
- **Error Handling**: Centralized error handling with custom error responses
- **File Uploads**: Support for file uploads with Multer
- **Email**: Nodemailer integration for sending emails

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Stripe account (for payment processing)
- PayPal account (for payment processing)
- SMTP service (for sending emails)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mockitupai.git
   cd mockitupai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   
   # MongoDB
   MONGO_URI=mongodb://localhost:27017/mockitupai
   
   # JWT
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=30
   
   # Email
   SMTP_HOST=your_smtp_host
   SMTP_PORT=587
   SMTP_EMAIL=your_email@example.com
   SMTP_PASSWORD=your_email_password
   FROM_EMAIL=noreply@mockitupai.com
   FROM_NAME=MockItUp AI
   
   # Stripe
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   
   # PayPal
   PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_SECRET=your_paypal_secret
   PAYPAL_WEBHOOK_ID=your_paypal_webhook_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:5000`

## API Documentation

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `PUT /api/v1/auth/updatedetails` - Update user details
- `PUT /api/v1/auth/updatepassword` - Update password
- `POST /api/v1/auth/forgotpassword` - Forgot password
- `PUT /api/v1/auth/resetpassword/:resettoken` - Reset password

### Templates

- `GET /api/v1/templates` - Get all templates
- `GET /api/v1/templates/:id` - Get single template
- `POST /api/v1/templates` - Create new template (Admin only)
- `PUT /api/v1/templates/:id` - Update template (Admin only)
- `DELETE /api/v1/templates/:id` - Delete template (Admin only)
- `GET /api/v1/templates/category/:category` - Get templates by category
- `GET /api/v1/templates/search?q=query` - Search templates

### Users (Admin only)

- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get single user
- `POST /api/v1/users` - Create new user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

## Payment Processing

### Stripe

- `POST /api/create-subscription` - Create a new subscription
- `POST /api/update-subscription` - Update an existing subscription
- `POST /api/cancel-subscription` - Cancel a subscription
- `POST /webhook/stripe` - Stripe webhook endpoint

### PayPal

- `POST /api/paypal/create-subscription` - Create a PayPal subscription
- `POST /api/paypal/capture-order` - Capture a PayPal order
- `POST /webhook/paypal` - PayPal webhook endpoint

## Development

### Running in Development Mode

```bash
npm run dev
```

### Running in Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

### Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run all tests
npm run test:all
```

## Deployment

The application can be deployed to any Node.js hosting platform (e.g., Heroku, AWS, DigitalOcean). Make sure to set up the required environment variables in your hosting environment.

## Security

- All API routes are protected with JWT authentication
- Role-based access control for admin routes
- Rate limiting to prevent brute force attacks
- Data sanitization to prevent NoSQL injection
- Helmet for setting secure HTTP headers
- CORS enabled for cross-origin requests
- XSS protection
- HTTP Parameter Pollution protection

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Stripe](https://stripe.com/)
- [PayPal](https://www.paypal.com/)
- [JWT](https://jwt.io/)
- [Nodemailer](https://nodemailer.com/)
