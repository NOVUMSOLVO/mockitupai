require('dotenv').config({ path: '.env' });
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('Environment variables loaded successfully!');
