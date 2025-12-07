const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function testView() {
  try {
    // ID provided by user in previous logs
    const pdfId = '6935e7b3f680653c9258ba5e'; 
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
      console.error('❌ View Failed:', error.response.status);
      // If responseType is stream, error.response.data is a stream
      if (error.response.data && error.response.data.on) {
        error.response.data.on('data', (chunk) => {
          console.error('Error Body:', chunk.toString());
        });
      } else {
        console.error('Error Data:', error.response.data);
      }
    } else {
      console.error('❌ View Error:', error.message);
    }
  }
}

testView();
