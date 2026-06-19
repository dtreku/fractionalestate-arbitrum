import axios from 'axios';

const PINATA_API_URL = 'https://api.pinata.cloud';

export async function uploadFileToPinata(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`${PINATA_API_URL}/pinning/pinFileToIPFS`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      pinata_api_key: process.env.PINATA_API_KEY!,
      pinata_secret_api_key: process.env.PINATA_SECRET_KEY!,
    },
    maxBodyLength: Infinity,
  });
  return `ipfs://${response.data.IpfsHash}`;
}

export async function uploadMetadataToPinata(metadata: object): Promise<string> {
  const response = await axios.post(`${PINATA_API_URL}/pinning/pinJSONToIPFS`, metadata, {
    headers: {
      'Content-Type': 'application/json',
      pinata_api_key: process.env.PINATA_API_KEY!,
      pinata_secret_api_key: process.env.PINATA_SECRET_KEY!,
    },
  });
  return `ipfs://${response.data.IpfsHash}`;
}

export function ipfsToHttp(ipfsUri: string): string {
  if (!ipfsUri) return '';
  if (ipfsUri.startsWith('ipfs://')) {
    return `${process.env.NEXT_PUBLIC_PINATA_GATEWAY}${ipfsUri.replace('ipfs://', '')}`;
  }
  return ipfsUri;
}

export interface PropertyMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{ trait_type: string; value: string | number }>;
}

export async function createPropertyMetadata(
  name: string, description: string, imageUri: string, location: string,
  propertyType: string, totalShares: number, pricePerShare: number, annualYield: number
): Promise<string> {
  const metadata: PropertyMetadata = {
    name, description, image: imageUri,
    attributes: [
      { trait_type: 'Property Type', value: propertyType },
      { trait_type: 'Location', value: location },
      { trait_type: 'Total Shares', value: totalShares },
      { trait_type: 'Price Per Share', value: `${pricePerShare} ETH` },
      { trait_type: 'Annual Yield', value: `${annualYield}%` },
    ],
  };
  return uploadMetadataToPinata(metadata);
}
