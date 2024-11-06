// src/lib/ipfs.ts
import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT as string, // Note: changed from pinataJWTKey to pinataJwt
  pinataGateway: "amethyst-quiet-firefly-666.mypinata.cloud",
});

const PINATA_GATEWAY = "https://gateway.pinata.cloud/ipfs/";

export async function uploadToIPFS(file: File): Promise<string> {
  try {
    const result = await pinata.upload.file(file);
    console.log(
      "`${PINATA_GATEWAY}${result.cid}`",
      `${PINATA_GATEWAY}${result.cid}`
    );
    return `${PINATA_GATEWAY}${result.cid}`; // Using Pinata gateway
  } catch (error) {
    console.error("IPFS upload error:", error);
    throw new Error("Failed to upload to IPFS");
  }
}

export function createMetadata(
  name: string,
  description: string,
  imageUrl: string
) {
  return {
    name,
    description,
    image: imageUrl,
    attributes: [],
  };
}

export async function uploadMetadataToIPFS(metadata: any): Promise<string> {
  try {
    const result = await pinata.upload.json(metadata);
    return result.cid; // Just return the CID, not the full URL
  } catch (error) {
    console.error("Metadata upload error:", error);
    throw new Error("Failed to upload metadata to IPFS");
  }
}

import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";

const client = createPublicClient({
  chain: sepolia,
  transport: http(),
});

const NFT_CONTRACT_ADDRESS = "0xc507d4FbD9b5Bd102668c00a3eF7ec68bF95C6A1";
const TOKEN_ID = 209n;

export async function verifyNFT() {
  try {
    const tokenURI = await client.readContract({
      address: NFT_CONTRACT_ADDRESS,
      abi: [
        {
          inputs: [
            { internalType: "uint256", name: "tokenId", type: "uint256" },
          ],
          name: "tokenURI",
          outputs: [{ internalType: "string", name: "", type: "string" }],
          stateMutability: "view",
          type: "function",
        },
      ],
      functionName: "tokenURI",
      args: [TOKEN_ID],
    });

    console.log("Token URI:", tokenURI);

    // Fetch metadata
    const response = await fetch(tokenURI);
    const metadata = await response.json();
    console.log("Metadata:", metadata);

    // Verify image
    if (metadata.image) {
      const imageResponse = await fetch(metadata.image);
      console.log("Image status:", imageResponse.status);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

verifyNFT();
