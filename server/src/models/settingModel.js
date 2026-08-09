import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    logo: { type: String, default: '' },
    contactNumber: { type: String, default: '' },
    whatsappNumber: { type: String, default: '' },
    address: { type: String, default: '' },
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      website: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export const Setting = mongoose.model('Setting', settingSchema);