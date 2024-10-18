import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const runtime = 'nodejs';

async function convertPDFtoBase64(pdfBuffer: Buffer) {
  try {
    console.log('Sending PDF to Railway service for Base64 conversion...');
    
    const response = await axios.post(
      'https://onvapdf2base64.up.railway.app',  // Railway service URL
      pdfBuffer,
      {
        headers: {
          'Content-Type': 'application/pdf',
        },
        responseType: 'text',  // Expect Base64 encoded string as text
      }
    );
    
    if (response.status !== 200) {
      console.error(`Railway service error: ${response.status}`);
      throw new Error(`Failed to convert PDF with status: ${response.status}`);
    }

    console.log('Successfully converted PDF to Base64.');
    return response.data;  // Base64-encoded PDF string
  } catch (error) {
    console.error('Error converting PDF to Base64:', error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  console.log('Received POST request.');
  const contentType = req.headers.get('content-type');
  if (!contentType?.includes('multipart/form-data')) {
    console.error('Invalid content type.');
    return NextResponse.json({ error: 'Invalid content type. Expected multipart/form-data.' }, { status: 400 });
  }

  try {
    // Read the PDF file from the request body
    const body = await req.arrayBuffer();
    const buffer = Buffer.from(body);
    console.log('Request body converted to buffer.');

    // Send the PDF to the Railway service and get the Base64 response
    const base64PDF = await convertPDFtoBase64(buffer);

    // Return the Base64-encoded PDF to the client
    return NextResponse.json({ base64: base64PDF }, { status: 200 });
  } catch (error) {
    console.error('Error during PDF processing:', error);
    return NextResponse.json({ error: 'An error occurred while processing the PDF.' }, { status: 500 });
  }
}
