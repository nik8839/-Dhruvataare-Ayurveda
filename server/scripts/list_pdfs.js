const axios = require('axios');

async function listPDFs() {
  try {
    const response = await axios.get('http://localhost:5000/api/pdfs');
    console.log('✅ PDFs Found:', response.data.count);
    if (response.data.data.length > 0) {
      console.log('Sample PDF:', response.data.data[0]);
      console.log('ID to use:', response.data.data[0]._id);
    } else {
      console.log('❌ No PDFs found in DB');
    }
  } catch (error) {
    console.error('❌ List Failed:', error.message);
  }
}

listPDFs();
