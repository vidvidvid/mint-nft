// src/pages/api/ipfs/upload.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PinataSDK } from "pinata";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("1. API Route hit - Method:", req.method);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.PINATA_JWT) {
    console.error("PINATA_JWT is missing");
    return res.status(500).json({ error: "Pinata configuration missing" });
  }

  const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
  });

  try {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024,
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const file = files.file?.[0];
    if (!file) {
      return res.status(400).json({ error: "No file provided" });
    }

    console.log("File details:", {
      name: file.originalFilename,
      size: file.size,
      path: file.filepath,
    });

    // Read file content and create a proper File object
    const content = fs.readFileSync(file.filepath);
    const blob = new Blob([content], {
      type: file.mimetype || "application/octet-stream",
    });

    // Create a proper File object
    const fileObject = new File(
      [blob],
      file.originalFilename || "upload.file",
      { type: file.mimetype || "application/octet-stream" }
    );

    // Upload using the proper File object
    const result = await pinata.upload.file(fileObject);
    console.log("Pinata response:", result);

    // Clean up
    try {
      fs.unlinkSync(file.filepath);
    } catch (cleanupError) {
      console.error("Cleanup error:", cleanupError);
    }

    return res.status(200).json({
      id: result.id,
      cid: result.cid,
      url: `https://gateway.pinata.cloud/ipfs/${result.cid}`,
      name: result.name,
      size: result.size,
    });
  } catch (error) {
    console.error("Upload handler error:", error);
    return res.status(500).json({
      error: "Failed to upload to IPFS",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
