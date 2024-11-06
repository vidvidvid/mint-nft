const PINATA_API_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";
const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;

export async function uploadToIPFS(file: File | Blob): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(PINATA_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to upload to IPFS");
  }

  const data = await res.json();
  return `https://ipfs.io/ipfs/${data.IpfsHash}`;
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
