import { CANTO_MAINNET_EVM, CANTO_TESTNET_EVM } from "@/config/networks";

const AMBIENT_ADDRESSES = {
  crocQuery: {
    mainnet: "0x7878ae4EAd0C3f4993173f2B40F84f4B89DD6995",
    testnet: "0x7878ae4EAd0C3f4993173f2B40F84f4B89DD6995",
  },
  crocDex: {
    mainnet: "0x7580bFE88Dd3d07947908FAE12d95872a260F2D8",
    testnet: "0x7580bFE88Dd3d07947908FAE12d95872a260F2D8",
  },
} as const;

export function getAmbientAddress(
  chainId: number,
  key: keyof typeof AMBIENT_ADDRESSES
): string | null {
  switch (chainId) {
    case CANTO_MAINNET_EVM.chainId:
      return AMBIENT_ADDRESSES[key].mainnet;
    case CANTO_TESTNET_EVM.chainId:
      return AMBIENT_ADDRESSES[key].testnet;
    default:
      return null;
  }
}
