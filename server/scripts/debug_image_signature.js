require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const axios = require('axios');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const publicId = 'dhruvataare-pdfs/pdf-1765140265181-598647385'; // No extension for image
const version = '1765140067';

async function test() {
  console.log('🚀 Testing Signed URL for Image...');
  
  // Generate signed URL
  const signedUrl = cloudinary.url(publicId, {
    resource_type: 'image',
    sign_url: true,
    version: version,
    secure: true,
    format: 'pdf' // Explicitly ask for PDF format
  });
  
  console.log('Generated URL:', signedUrl);
  
  try {
    const response = await axios.get(signedUrl);
    console.log('✅ Access Success! Status:', response.status);
  } catch (error) {
    console.error('❌ Access Failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

test();
