const axios = require('axios');

const url = 'https://res.cloudinary.com/dblqe6w1e/raw/upload/v1765140204/dhruvataare-pdfs/pdf-1765140401297-828867499';

async function test() {
  console.log(`🚀 Testing Public Access: ${url}`);
  try {
    const response = await axios.get(url);
    console.log('✅ Access Success! Status:', response.status);
    console.log('Content-Length:', response.headers['content-length']);
  } catch (error) {
    console.error('❌ Access Failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

test();
