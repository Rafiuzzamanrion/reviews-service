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
  termsAndConditions: String,
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

if (mongoose.models.Product) {
  delete mongoose.models.Product;
}
export default mongoose.model('Product', ProductSchema);
