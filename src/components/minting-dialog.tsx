import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import SpecialButton from "./special-button";
import { PINATA_GATEWAY } from "@/lib/ipfs";

interface MintingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isError?: boolean;
  transactionHash?: string;
  imageUrl?: string;
}

const MintingDialog: React.FC<MintingDialogProps> = ({
  open,
  onOpenChange,
  isError = false,
  transactionHash,
  imageUrl,
}) => {
  const getDisplayUrl = (url: string) => {
    if (!url) return undefined;
    console.log("url", url);

    // If already using Pinata gateway, return as is
    if (url.includes(PINATA_GATEWAY)) {
      return url;
    }

    // For any other format, try to extract the CID
    const cid = url.split("/ipfs/")[1] || url.replace("ipfs://", "");
    return cid ? `${PINATA_GATEWAY}${cid}` : url;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='bg-[#030014]/90 border border-purple-500/20 backdrop-blur-sm sm:max-w-md'>
        <DialogHeader>
          {isError ? (
            <div className='mx-auto mb-4'>
              <div className='h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center'>
                <XCircle className='h-8 w-8 text-red-500' />
              </div>
            </div>
          ) : imageUrl ? (
            <div className='w-48 h-48 mx-auto relative mb-6'>
              <div className='absolute inset-0 bg-gradient-to-b from-blue-500/20 to-purple-500/20 rounded-full blur-2xl' />
              <img
                src={getDisplayUrl(imageUrl)}
                alt='Minted NFT'
                className='w-full h-full object-contain relative z-10 rounded-lg'
              />
            </div>
          ) : (
            <div className='mx-auto mb-4'>
              <div className='h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center'>
                <CheckCircle2 className='h-8 w-8 text-green-500' />
              </div>
            </div>
          )}

          <DialogTitle className='text-2xl text-center font-bold text-white'>
            {isError ? "Minting Failed" : "NFT Minted Successfully!"}
          </DialogTitle>
          <DialogDescription className='text-center text-gray-400'>
            {isError
              ? "There was an error while minting your NFT. Please try again."
              : "Your NFT has been minted and added to your collection."}
          </DialogDescription>
        </DialogHeader>

        {!isError && transactionHash && (
          <div className='bg-purple-500/10 rounded-lg p-4 mt-2'>
            <p className='text-sm text-purple-300 break-all'>
              Transaction Hash: {transactionHash}
            </p>
          </div>
        )}

        <DialogFooter className='sm:justify-center'>
          {isError ? (
            <Button variant='destructive' onClick={() => onOpenChange(false)}>
              Try Again
            </Button>
          ) : (
            <div>
              <SpecialButton
                onClick={() => onOpenChange(false)}
                label='Continue'
              />
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MintingDialog;
