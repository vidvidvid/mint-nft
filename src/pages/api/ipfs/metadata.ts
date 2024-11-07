import type { NextApiRequest, NextApiResponse } from "next";
import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.PINATA_JWT) {
    return res.status(500).json({ error: "Pinata configuration missing" });
  }

  try {
    const metadata = req.body;
    // Use the new upload.json method
    const result = await pinata.upload.json(metadata);

    return res.status(200).json({
      id: result.id,
      cid: result.cid,
      url: `https://gateway.pinata.cloud/ipfs/${result.cid}`,
    });
  } catch (error) {
    console.error("Metadata upload error:", error);
    return res.status(500).json({
      error: "Failed to upload metadata",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
