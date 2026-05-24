import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  minOrder: {
    type: Number,
    required: true,
    default: 1,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  format: String,
  access: String,
  policy: String,
  instantDelivery: {
    type: Boolean,
    default: true,
  },
  badge: String,
  isActive: {
    type: Boolean,
    default: true,
  },
  projectSource: {
    type: String,
    default: 'premiums-edu',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
