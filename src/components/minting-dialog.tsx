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
import { XCircle, Loader2, ExternalLink, Check } from "lucide-react";
import { useTransaction, useWaitForTransactionReceipt } from "wagmi";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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
  const showOptimisticSuccess = !!transactionHash && !isError;
  const { data } = useTransaction({ hash: transactionHash as `0x${string}` });

  const { isSuccess: isConfirmed, data: transaction } =
    useWaitForTransactionReceipt({
      hash: transactionHash as `0x${string}`,
      confirmations: 1,
    });

  const showLoadingState = !showOptimisticSuccess && !isError;

  const openSeaUrl =
    transaction?.to && data?.nonce
      ? `https://testnets.opensea.io/assets/sepolia/${transaction.to}/${
          data?.nonce - 3
        }`
      : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='bg-[#030014]/90 border border-purple-500/20 backdrop-blur-sm sm:max-w-md'>
        <DialogHeader>
          {isError ? (
            <div className='mx-auto mb-4'>
              <div className='h-12 w-12 rounded-full bg-destructive/20 flex items-center justify-center'>
                <XCircle className='h-8 w-8 text-destructive' />
              </div>
            </div>
          ) : showLoadingState ? (
            <div className='mx-auto mb-4'>
              <div className='h-12 w-12 rounded-full bg-muted flex items-center justify-center'>
                <Loader2 className='h-8 w-8 text-muted-foreground animate-spin' />
              </div>
            </div>
          ) : !isConfirmed ? (
            <div className='mx-auto mb-4 relative'>
              <div className='absolute inset-0 rounded-full bg-purple-500/20 animate-ping' />
              <div className='relative h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center'>
                <Loader2 className='h-8 w-8 text-purple-500 animate-spin' />
              </div>
            </div>
          ) : (
            <div className='mx-auto mb-4'>
              <div className='h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center'>
                <Check className='h-8 w-8 text-green-500' />
              </div>
            </div>
          )}

          <DialogTitle className='text-2xl text-center font-bold'>
            {isError
              ? "Minting Failed"
              : showLoadingState
              ? "Minting your NFT..."
              : "NFT Minted Successfully!"}
          </DialogTitle>

          <DialogDescription className='text-center'>
            {isError
              ? "There was an error while minting your NFT. Please try again."
              : showLoadingState
              ? "Please wait while we process your transaction..."
              : isConfirmed
              ? "Your NFT has been minted and confirmed on the blockchain!"
              : "Your NFT is being minted. You can view the transaction status below."}
          </DialogDescription>
        </DialogHeader>

        {showOptimisticSuccess && (
          <>
            {transactionHash && (
              <Card className='border-purple-500/20 bg-purple-500/10'>
                <CardContent className='pt-4'>
                  <div className='flex items-center justify-between mb-2'>
                    <Badge
                      variant='outline'
                      className='text-purple-300 border-purple-500/20'
                    >
                      Transaction Hash
                    </Badge>
                    {!isConfirmed && (
                      <Badge
                        variant='outline'
                        className='text-purple-300 border-purple-500/20'
                      >
                        Pending
                      </Badge>
                    )}
                  </div>
                  <p className='text-sm text-purple-300 break-all font-mono'>
                    {transactionHash}
                  </p>
                  {!isConfirmed && (
                    <div className='mt-4'>
                      <Progress value={33} className='bg-purple-500/20' />
                      <p className='text-xs text-purple-300 mt-2'>
                        Waiting for confirmation...
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            {openSeaUrl && (
              <div className='mt-4'>
                <Button
                  variant='outline'
                  className='w-full '
                  onClick={() => window.open(openSeaUrl, "_blank")}
                >
                  <ExternalLink className='w-4 h-4 mr-2' />
                  View on OpenSea
                </Button>
              </div>
            )}
          </>
        )}

        <DialogFooter className='sm:justify-center'>
          {isError ? (
            <Button variant='destructive' onClick={() => onOpenChange(false)}>
              Try Again
            </Button>
          ) : (
            showLoadingState && (
              <Button disabled variant='outline'>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Processing
              </Button>
            )
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MintingDialog;
