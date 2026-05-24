import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  paymentMethods: [
    {
      name: {
        type: String,
        required: true,
      },
      key: {
        type: String,
        required: true,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
      details: [
        {
          label: {
            type: String,
            required: true,
          },
          value: {
            type: String,
            required: true,
          },
          name: String,
        },
      ],
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
