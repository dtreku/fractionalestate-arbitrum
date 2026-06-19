import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const pinataFormData = new FormData();
    pinataFormData.append('file', file);

    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', pinataFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        pinata_api_key: process.env.PINATA_API_KEY!,
        pinata_secret_api_key: process.env.PINATA_SECRET_KEY!,
      },
      maxBodyLength: Infinity,
    });

    return NextResponse.json({ ipfsHash: response.data.IpfsHash, uri: `ipfs://${response.data.IpfsHash}` });
  } catch (error: any) {
    console.error('Pinata upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
