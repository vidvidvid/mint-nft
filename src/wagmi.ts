import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Mint NFT",
  projectId: "ce880beece81c260d8d1a34c61a2ef1e",
  chains: [sepolia],
  ssr: true,
});
