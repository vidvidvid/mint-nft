import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XCircle, Loader2, ExternalLink } from "lucide-react";
import { useTransaction, useBlockNumber } from "wagmi";

interface MintingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isError?: boolean;
  transactionHash?: string;
}

const MintingDialog: React.FC<MintingDialogProps> = ({
  open,
  onOpenChange,
  isError = false,
  transactionHash,
}) => {
  const { data: currentBlock } = useBlockNumber({
    watch: true,
  });

  const { data: transaction } = useTransaction({
    hash: transactionHash as `0x${string}`,
  });

  // Consider confirmed if transaction exists and block number exists
  const isConfirmed = !!transaction?.blockNumber && !!currentBlock;
  const showSuccessState = isConfirmed;
  const showLoadingState = !showSuccessState && !isError && !!transactionHash;

  const openSeaUrl = `https://testnets.opensea.io/assets/sepolia/${
    transaction?.to
  }/${transaction?.nonce ? transaction.nonce - 3 : 0}`;

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
          ) : showLoadingState ? (
            <div className='mx-auto mb-4'>
              <div className='h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center'>
                <Loader2 className='h-8 w-8 text-purple-500 animate-spin' />
              </div>
            </div>
          ) : null}

          <DialogTitle className='text-2xl text-center font-bold text-white'>
            {isError
              ? "Minting Failed"
              : showLoadingState
              ? "Minting your NFT..."
              : "NFT Minted Successfully!"}
          </DialogTitle>

          <DialogDescription className='text-center text-gray-400'>
            {isError
              ? "There was an error while minting your NFT. Please try again."
              : showLoadingState
              ? "Please wait while we process your transaction..."
              : "Your NFT has been minted and added to your collection."}
          </DialogDescription>
        </DialogHeader>

        {showSuccessState && (
          <>
            {transactionHash && (
              <div className='bg-purple-500/10 rounded-lg p-4'>
                <p className='text-sm text-purple-300 break-all'>
                  Transaction Hash: {transactionHash}
                </p>
              </div>
            )}
            <div className='mt-4'>
              <Button
                className='w-full bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
                onClick={() => window.open(openSeaUrl, "_blank")}
              >
                <ExternalLink className='w-4 h-4 mr-2' />
                View on OpenSea
              </Button>
            </div>
          </>
        )}

        <DialogFooter className='sm:justify-center'>
          {isError ? (
            <Button variant='destructive' onClick={() => onOpenChange(false)}>
              Try Again
            </Button>
          ) : showLoadingState ? (
            <Button disabled className='bg-purple-500/20 text-purple-300'>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Processing
            </Button>
          ) : (
            <Button
              onClick={() => onOpenChange(false)}
              className='bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
            >
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MintingDialog;
