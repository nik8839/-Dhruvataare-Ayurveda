require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const publicId = 'dhruvataare-pdfs/pdf-1765139213329-943408152.pdf';
const version = '1765139213';
const targetSignature = 'QtiQ5DhQ';

console.log('Target Signature:', targetSignature);

function test(params, label) {
  const url = cloudinary.url(publicId, params);
  const sigMatch = url.match(/s--([^-]+)--/);
  const sig = sigMatch ? sigMatch[1] : 'NONE';
  console.log(`[${label}] Sig: ${sig} | Match? ${sig === targetSignature}`);
  if (sig === targetSignature) console.log('🎉 FOUND IT!');
}

test({
  resource_type: 'raw',
  sign_url: true,
  type: 'authenticated',
  version: version,
  secure: true
}, 'Current Config (String Version)');

test({
  resource_type: 'raw',
  sign_url: true,
  type: 'authenticated',
  version: parseInt(version),
  secure: true
}, 'Number Version');

test({
  resource_type: 'raw',
  sign_url: true,
  type: 'authenticated',
  version: version,
  secure: true,
  auth_token: null // Explicitly null?
}, 'Auth Token Null');

// Maybe public_id should NOT have extension?
const publicIdNoExt = publicId.replace('.pdf', '');
const urlNoExt = cloudinary.url(publicIdNoExt, {
  resource_type: 'raw',
  sign_url: true,
  type: 'authenticated',
  version: version,
  secure: true
});
// But this would generate wrong URL path...
console.log('No Ext URL:', urlNoExt);

// Maybe type should be 'upload'?
test({
  resource_type: 'raw',
  sign_url: true,
  type: 'upload',
  version: version,
  secure: true
}, 'Type Upload');

// Maybe type should be 'private'?
test({
  resource_type: 'raw',
  sign_url: true,
  type: 'private',
  version: version,
  secure: true
}, 'Type Private');
