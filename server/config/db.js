const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      maxPoolSize: 10, // Maintain up to 10 socket connections
      retryWrites: true,
      w: 'majority'
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('!!! MongoDB Connection Error !!!');
    console.error(`Error Message: ${err.message}`);
    console.error(`Full Error: ${err.stack}`);
    console.error('MONGO_URI used:', process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 20) + '...' : 'Not Defined');
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
