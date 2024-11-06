import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import { MintingForm } from "@/components/minting-form";
import Head from "next/head";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { sepolia } from "viem/chains";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Logo } from "@/components/logo";

const Home: NextPage = () => {
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { isConnected } = useAccount();
  const { toast } = useToast();

  const isWrongNetwork = chainId !== sepolia.id;

  useEffect(() => {
    if (isConnected && isWrongNetwork) {
      toast({
        title: "Wrong Network",
        description: "Please switch to Sepolia network to mint NFTs",
        variant: "destructive",
      });

      try {
        switchChain({ chainId: sepolia.id });
      } catch (error) {
        console.error("Failed to switch network:", error);
      }
    }
  }, [chainId, isConnected, switchChain, toast, isWrongNetwork]);

  return (
    <div
      className='min-h-screen bg-[#030014] p-4'
      style={{
        backgroundImage: "url('/images/bg.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Head>
        <title>NFT Sea - Mint NFTs</title>
        <meta name='description' content='Mint your NFTs on NFT Sea' />
      </Head>

      <nav className='container mx-auto flex justify-between items-center py-6 px-4'>
        <Logo />
        <ConnectButton chainStatus='icon' />
      </nav>

      {isConnected && isWrongNetwork ? (
        <div className='max-w-xl mx-auto mt-20 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-center'>
          <h2 className='text-xl font-bold text-red-500 mb-2'>Wrong Network</h2>
          <p className='text-white/80 mb-4'>
            Please switch to Sepolia network to mint NFTs
          </p>
          <button
            onClick={() => switchChain({ chainId: sepolia.id })}
            className='px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md text-white transition-colors'
          >
            Switch to Sepolia
          </button>
        </div>
      ) : (
        <MintingForm />
      )}
    </div>
  );
};

export default Home;
