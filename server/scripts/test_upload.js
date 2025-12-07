const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testUpload() {
  try {
    // Create a dummy PDF file
    const dummyPdfPath = path.join(__dirname, 'test.pdf');
    fs.writeFileSync(dummyPdfPath, '%PDF-1.4\n%\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/Resources <<\n/Font <<\n/F1 4 0 R\n>>\n>>\n/MediaBox [0 0 612 792]\n/Contents 5 0 R\n>>\nendobj\n4 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n>>\nendobj\n5 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 24 Tf\n100 100 Td\n(Hello World) Tj\nET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f\n0000000010 00000 n\n0000000060 00000 n\n0000000117 00000 n\n0000000224 00000 n\n0000000311 00000 n\ntrailer\n<<\n/Size 6\n/Root 1 0 R\n>>\nstartxref\n406\n%%EOF');

    const form = new FormData();
    form.append('pdf', fs.createReadStream(dummyPdfPath));
    form.append('title', 'Test PDF');
    form.append('category', 'notes');
    form.append('year', '1st-year');
    form.append('subject', 'Test Subject');
    form.append('filePath', 'dummy'); // Required by schema but overwritten by controller
    form.append('fileName', 'test.pdf');
    form.append('fileSize', '1024');

    console.log('🚀 Sending upload request...');
    const response = await axios.post('http://localhost:5000/api/pdfs', form, {
      headers: {
        ...form.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    console.log('✅ Upload Success:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('❌ Upload Failed:', error.response.status, error.response.data);
    } else {
      console.error('❌ Upload Error:', error.message);
    }
  }
}

testUpload();
