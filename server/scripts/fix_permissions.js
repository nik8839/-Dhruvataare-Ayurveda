require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function fixPermissions() {
  try {
    console.log('🚀 Moving PDF to authenticated storage...');
    const publicId = 'dhruvataare-pdfs/pdf-1765139213329-943408152.pdf';
    const newPublicId = publicId.replace('.pdf', '.bin');
    
    console.log(`Renaming ${publicId} to ${newPublicId}`);

    const result = await cloudinary.uploader.rename(
      publicId, 
      newPublicId,
      { 
        resource_type: 'raw', 
        type: 'authenticated', // Current type
        overwrite: true 
      }
    );
    
    console.log('✅ Move Success:', result);
  } catch (error) {
    console.error('❌ Move Failed:', error.message);
    if (error.error) {
      console.error('Error Details:', error.error);
    }
  }
}

fixPermissions();
