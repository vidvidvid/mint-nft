import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { alchemyService } from "@/lib/alchemy";

export function getConfig() {
  return getDefaultConfig({
    appName: "Mint NFT",
    projectId: "ce880beece81c260d8d1a34c61a2ef1e",
    chains: [sepolia],
    ssr: true,
    transports: {
      [sepolia.id]: http(alchemyService.getEndpoint()),
    },
  });
}
