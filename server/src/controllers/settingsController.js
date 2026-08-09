import asyncHandler from 'express-async-handler';
import { Setting } from '../models/settingModel.js';

export const getSettings = asyncHandler(async (_, response) => {
  const setting = (await Setting.findOne().sort({ createdAt: -1 })) || (await Setting.create({}));
  response.json({ setting });
});

export const updateSettings = asyncHandler(async (request, response) => {
  const setting = (await Setting.findOne()) || new Setting({});
  const { logo, contactNumber, whatsappNumber, address, socialLinks } = request.body;

  setting.logo = logo ?? setting.logo;
  setting.contactNumber = contactNumber ?? setting.contactNumber;
  setting.whatsappNumber = whatsappNumber ?? setting.whatsappNumber;
  setting.address = address ?? setting.address;
  setting.socialLinks = socialLinks ?? setting.socialLinks;

  await setting.save();
  response.json({ setting });
});
