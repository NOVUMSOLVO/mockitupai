const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');
const Template = require('../models/Template');
const User = require('../models/User');

// Load env vars
dotenv.config({ path: '.env' });

// Log environment variables for debugging
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Found' : 'Not found');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  family: 4, // Use IPv4, skip trying IPv6
  maxPoolSize: 10, // Maintain up to 10 socket connections
  retryWrites: true,
  w: 'majority'
});

// Sample template data
const templates = [
  {
    name: 'E-commerce Store',
    description: 'A modern e-commerce template with product listings, cart, and checkout functionality.',
    category: 'E-commerce',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
    previewImage: 'https://via.placeholder.com/800x600/4A90E2/FFFFFF?text=E-commerce+Store',
    price: 99.99,
    isFree: false,
    rating: 4.5,
    features: [
      'Product catalog',
      'Shopping cart',
      'Checkout process',
      'User authentication',
      'Order management'
    ],
    requirements: ['Node.js', 'MongoDB', 'npm/yarn']
  },
  {
    name: 'Portfolio Website',
    description: 'A clean and responsive portfolio template to showcase your work and skills.',
    category: 'Portfolio',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'React'],
    previewImage: 'https://via.placeholder.com/800x600/50E3C2/FFFFFF?text=Portfolio+Website',
    price: 49.99,
    isFree: true,
    rating: 4.2,
    features: [
      'Responsive design',
      'Project showcase',
      'About section',
      'Contact form',
      'Social media integration'
    ],
    requirements: ['Modern web browser']
  },
  {
    name: 'Blog Platform',
    description: 'A full-featured blog template with rich text editing and user comments.',
    category: 'Blog',
    technologies: ['Next.js', 'Node.js', 'MongoDB', 'Express'],
    previewImage: 'https://via.placeholder.com/800x600/9013FE/FFFFFF?text=Blog+Platform',
    price: 79.99,
    isFree: false,
    rating: 4.7,
    features: [
      'Rich text editor',
      'User authentication',
      'Comments system',
      'Categories and tags',
      'Responsive design'
    ],
    requirements: ['Node.js', 'MongoDB', 'npm/yarn']
  },
  {
    name: 'SaaS Dashboard',
    description: 'A modern admin dashboard template for SaaS applications with analytics and user management.',
    category: 'SaaS',
    technologies: ['React', 'Redux', 'Node.js', 'MongoDB'],
    previewImage: 'https://via.placeholder.com/800x600/F5A623/FFFFFF?text=SaaS+Dashboard',
    price: 149.99,
    isFree: false,
    rating: 4.8,
    features: [
      'Analytics dashboard',
      'User management',
      'Data visualization',
      'Role-based access',
      'Dark/light mode'
    ],
    requirements: ['Node.js', 'MongoDB', 'npm/yarn']
  },
  {
    name: 'Landing Page',
    description: 'A high-converting landing page template for your product or service.',
    category: 'Landing Page',
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    previewImage: 'https://via.placeholder.com/800x600/7ED321/FFFFFF?text=Landing+Page',
    price: 39.99,
    isFree: true,
    rating: 4.3,
    features: [
      'Responsive design',
      'Call-to-action buttons',
      'Feature highlights',
      'Testimonials',
      'Contact form'
    ],
    requirements: ['Web hosting']
  }
];

// Import sample data into DB
const importData = async () => {
  try {
    // Create a test admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@mockitupai.com',
      password: 'password123',
      role: 'admin'
    });

    // Add createdBy to templates
    const templatesWithUser = templates.map(template => ({
      ...template,
      createdBy: adminUser._id
    }));

    await Template.deleteMany();
    await Template.insertMany(templatesWithUser);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red);
    process.exit(1);
  }
};

// Delete all data from DB
const deleteData = async () => {
  try {
    await Template.deleteMany();
    await User.deleteMany();
    
    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red);
    process.exit(1);
  }
};

// Handle command line arguments
if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
}
