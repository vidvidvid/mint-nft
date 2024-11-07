// src/components/minting-form.tsx
import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from "@/lib/contracts";
import { Footer } from "./footer";
import SpecialButton from "./special-button";
import MintingDialog from "./minting-dialog";
import { NFTMetadata } from "@/types/ipfs";
import { ipfsService } from "@/lib/ipfs";

interface DialogState {
  open: boolean;
  error: boolean;
  transactionHash: string;
  imageUrl: string;
}

export function MintingForm() {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null as File | null,
  });

  const [dialogState, setDialogState] = useState<DialogState>({
    open: false,
    error: false,
    transactionHash: "",
    imageUrl: "",
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

      // Upload image
      const imageResult = await ipfsService.uploadFile(formData.image);

      // Open dialog to show upload success
      setDialogState((prev) => ({
        ...prev,
        open: true,
        imageUrl: imageResult.url,
        error: false,
      }));

      // Create and upload metadata
      const metadata: NFTMetadata = {
        name: formData.title,
        description: formData.description,
        image: imageResult.url,
        attributes: [],
      };
      const { cid } = await ipfsService.uploadMetadata(metadata);

      // Mint NFT
      const hash = await writeContractAsync({
        address: NFT_CONTRACT_ADDRESS,
        abi: NFT_CONTRACT_ABI,
        functionName: "mint",
        args: [address, cid],
      });

      setDialogState((prev) => ({
        ...prev,
        transactionHash: hash,
      }));

      toast({
        title: "Success",
        description: "NFT minted successfully!",
      });

      setFormData({ title: "", description: "", image: null });
    } catch (error) {
      console.error("Minting error:", error);
      setDialogState((prev) => ({
        ...prev,
        open: true,
        error: true,
      }));
      toast({
        title: "Error",
        description: "Failed to mint NFT",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='container mx-auto flex flex-col justify-center items-center p-4'>
      <Card className='mb-16 text-center bg-white/10 backdrop-blur-md p-12 rounded-xl shadow-2xl w-[70%]'>
        <h2 className='text-4xl font-bold text-white tracking-wider font-cinzel mb-6'>
          MINT NEW NFT
        </h2>
        <p className='text-gray-400 text-xl'>
          Create your unique NFT on the Ethereum blockchain
        </p>
      </Card>

      {/* <Button
        onClick={verifyNFT}
        className='mb-6 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
      >
        VERIFY
      </Button> */}

      <Card className='bg-[#030014]/50 border border-purple-500/20 shadow-2xl backdrop-blur-sm max-w-3xl'>
        <CardContent className='pt-8'>
          <form onSubmit={handleSubmit} className='space-y-8'>
            <div
              className='border-2 border-dashed border-purple-500/30 rounded-xl p-10 text-center cursor-pointer hover:border-purple-500/50 transition-colors bg-purple-500/5'
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
              <Upload className='w-12 h-12 text-purple-500 mx-auto mb-4' />
              <div className='text-lg text-purple-300'>
                {formData.image ? formData.image.name : "Upload Image"}
              </div>
              <div className='text-sm text-purple-500/70 mt-2'>
                Supported formats: JPG, PNG, GIF
              </div>
            </div>

            <Input
              placeholder='NFT Title'
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className='bg-purple-500/5 border-purple-500/20 focus:border-purple-500/50 text-white h-14 text-lg'
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
              className='bg-purple-500/5 border-purple-500/20 focus:border-purple-500/50 text-white min-h-[140px] text-lg'
            />

            <div className='flex gap-4 pt-4'>
              <Button
                type='button'
                disabled={!isConnected || isLoading}
                className='flex-1 text-white hover:text-purple-300 hover:bg-purple-500/10 h-14 text-sm font-medium tracking-wide'
                variant='ghost'
              >
                {isLoading ? "Minting..." : "Mint without listing"}
              </Button>
              <SpecialButton
                disabled={!isConnected || isLoading}
                label='Mint and list immediately'
              />
            </div>
          </form>
        </CardContent>
      </Card>

      <Footer />

      <MintingDialog
        open={dialogState.open}
        onOpenChange={(open) => setDialogState((prev) => ({ ...prev, open }))}
        isError={dialogState.error}
        transactionHash={dialogState.transactionHash}
        imageUrl={dialogState.imageUrl}
      />
    </div>
  );
}
