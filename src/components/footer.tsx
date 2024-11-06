import { Logo } from "@/components/logo";
import SpecialButton from "./special-button";

export const Footer = () => (
  <footer className='mt-12 flex justify-between items-center text-sm text-gray-400 px-4 w-full'>
    <div>
      <Logo />
    </div>
    <div className='mx-auto'>NFT Sea 2024 © All rights reserved</div>
    <div>
      <SpecialButton label='Explore Marketplace' />
    </div>
  </footer>
);
