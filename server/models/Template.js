const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: [
        'E-commerce',
        'Portfolio',
        'Blog',
        'SaaS',
        'Landing Page',
        'Dashboard',
        'Other'
      ]
    },
    technologies: [
      {
        type: String,
        required: true
      }
    ],
    previewImage: {
      type: String,
      required: [true, 'Please add a preview image URL']
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price must be at least 0']
    },
    isFree: {
      type: Boolean,
      default: false
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5']
    },
    version: {
      type: String,
      default: '1.0.0'
    },
    features: [String],
    requirements: [String],
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create a text index for search functionality
templateSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Template', templateSchema);
