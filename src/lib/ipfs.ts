// src/lib/ipfs.ts
import type { IPFSResponse, NFTMetadata } from "../types/ipfs";

class IPFSService {
  async uploadFile(file: File): Promise<IPFSResponse> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/ipfs/upload", {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        if (contentType?.includes("application/json")) {
          const error = await response.json();
          throw new Error(error.error || "Upload failed");
        } else {
          const text = await response.text();
          console.error("Server response:", text);
          throw new Error("Server error");
        }
      }

      return await response.json();
    } catch (error) {
      console.error("IPFS file upload error:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to upload file to IPFS"
      );
    }
  }

  async uploadMetadata(metadata: NFTMetadata): Promise<IPFSResponse> {
    try {
      const response = await fetch("/api/ipfs/metadata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metadata),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Metadata upload failed");
      }

      return await response.json();
    } catch (error) {
      console.error("IPFS metadata upload error:", error);
      throw new Error("Failed to upload metadata to IPFS");
    }
  }

  processUrl(url: string | undefined): string | undefined {
    if (!url) return undefined;

    try {
      if (url.includes("gateway.pinata.cloud")) {
        return url;
      }

      let cid: string | undefined;

      if (url.includes("/ipfs/")) {
        cid = url.split("/ipfs/")[1];
      } else if (url.startsWith("ipfs://")) {
        cid = url.replace("ipfs://", "");
      } else {
        cid = url;
      }

      return cid ? `https://gateway.pinata.cloud/ipfs/${cid}` : undefined;
    } catch (error) {
      console.error("Error processing IPFS URL:", error);
      return undefined;
    }
  }
}

export const ipfsService = new IPFSService();
