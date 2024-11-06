// src/components/minting-form.tsx
import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { uploadToIPFS, createMetadata } from "@/lib/ipfs";
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from "@/lib/contracts";

export function MintingForm() {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null as File | null,
  });

  const { writeContractAsync } = useWriteContract();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!formData.image || !formData.title || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Upload image to IPFS
      const imageUrl = await uploadToIPFS(formData.image);

      // Create and upload metadata
      const metadata = createMetadata(
        formData.title,
        formData.description,
        imageUrl
      );
      const tokenUri = await uploadToIPFS(new Blob([JSON.stringify(metadata)]));

      // Mint NFT
      const hash = await writeContractAsync({
        address: NFT_CONTRACT_ADDRESS,
        abi: NFT_CONTRACT_ABI,
        functionName: "mint",
        args: [address, tokenUri],
      });
      console.log("hash", hash);

      toast({
        title: "Success",
        description: "NFT minted successfully!",
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        image: null,
      });
    } catch (error) {
      console.error("Minting error:", error);
      toast({
        title: "Error",
        description: "Failed to mint NFT. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='max-w-3xl mx-auto'>
      <div className='mb-8 text-center'>
        <h2 className='text-3xl font-bold text-white tracking-wider'>
          MINT NEW NFT
        </h2>
        <p className='text-gray-400 mt-2'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sem
          tortor quis amet scelerisque vivamus egestas.
        </p>
      </div>

      <Card className='bg-transparent border border-purple-500/20 shadow-xl backdrop-blur-sm'>
        <CardContent className='pt-6'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div
              className='border-2 border-dashed border-purple-500/30 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500/50 transition-colors'
              onClick={() => document.getElementById("image-upload")?.click()}
              onKeyUp={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  document.getElementById("image-upload")?.click();
                }
              }}
              tabIndex={0}
              role='button'
            >
              <input
                id='image-upload'
                type='file'
                className='hidden'
                accept='image/*'
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFormData((prev) => ({ ...prev, image: file }));
                  }
                }}
              />
              <Upload className='w-8 h-8 text-purple-500 mx-auto mb-2' />
              <div className='text-sm text-gray-400'>
                {formData.image ? formData.image.name : "Upload Image"}
              </div>
              <div className='text-xs text-gray-500 mt-1'>format supported</div>
            </div>

            <Input
              placeholder='NFT Title'
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className='bg-gray-800/50 border-purple-500/20 focus:border-purple-500/50 text-white h-12'
            />

            <Textarea
              placeholder='Description'
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className='bg-gray-800/50 border-purple-500/20 focus:border-purple-500/50 text-white min-h-[120px]'
            />

            <div className='flex gap-4 pt-4'>
              <Button
                type='submit'
                disabled={!isConnected || isLoading}
                className='flex-1 bg-purple-500 hover:bg-purple-600 text-white h-12'
                variant='default'
              >
                Mint and list immediately
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <footer className='mt-8 flex justify-between items-center text-sm text-gray-400'>
        <div>NFT Sea 2024 © All right reserved</div>
        <Button
          variant='ghost'
          className='text-purple-400 hover:text-purple-300 hover:bg-purple-500/10'
        >
          Explore Marketplace
        </Button>
      </footer>
    </div>
  );
}
