import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import { MintingForm } from "@/components/minting-form";
import Head from "next/head";
import { Button } from "@/components/ui/button";

const Home: NextPage = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-900 via-black to-black p-4'>
      <Head>
        <title>NFT Sea - Mint NFTs</title>
        <meta name='description' content='Mint your NFTs on NFT Sea' />
      </Head>

      <nav className='flex justify-between items-center mb-8'>
        <h1 className='text-2xl font-bold text-white'>
          NFT <span className='text-purple-500'>SEA</span>
        </h1>
        <ConnectButton />
      </nav>

      <MintingForm />
    </div>
  );
};

export default Home;
