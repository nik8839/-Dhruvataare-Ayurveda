require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testAdminApi() {
  try {
    console.log('🚀 Testing Admin API...');
    // Try to get details of the specific PDF
    const publicId = 'dhruvataare-pdfs/pdf-1765139213329-943408152.pdf';
    console.log(`Fetching resource: ${publicId}`);
    
    const result = await cloudinary.api.resource(publicId, { resource_type: 'raw' });
    console.log('✅ Admin API Success:', result);
  } catch (error) {
    console.error('❌ Admin API Failed:', error.message);
    if (error.error) {
      console.error('Error Details:', error.error);
    }
  }
}

testAdminApi();
