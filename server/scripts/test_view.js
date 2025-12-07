const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function testView() {
  try {
    // ID provided by user in previous logs
    const pdfId = '6935e09cddbe2a1a5013fd26'; 
    console.log(`🚀 Requesting PDF view for ID: ${pdfId}`);

    const response = await axios.get(`http://localhost:5000/api/pdfs/${pdfId}/view`, {
      responseType: 'stream'
    });

    console.log('✅ Response Status:', response.status);
    console.log('✅ Content-Type:', response.headers['content-type']);
    console.log('✅ Content-Disposition:', response.headers['content-disposition']);

    if (response.headers['content-type'] !== 'application/pdf') {
      console.error('❌ FAIL: Wrong Content-Type!');
    } else {
      console.log('✅ PASS: Correct Content-Type');
    }

    const writer = fs.createWriteStream('test_downloaded.pdf');
    response.data.pipe(writer);

    writer.on('finish', () => {
      console.log('✅ File downloaded successfully to test_downloaded.pdf');
    });

    writer.on('error', (err) => {
      console.error('❌ File write error:', err);
    });

  } catch (error) {
    if (error.response) {
      console.error('❌ View Failed:', error.response.status, error.response.data);
    } else {
      console.error('❌ View Error:', error.message);
    }
  }
}

testView();
