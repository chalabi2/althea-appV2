import { CosmosNetwork, EVMNetwork } from "@/config/interfaces";
import {
  checkCosmosAddress,
  getCosmosAddressLink,
  getCosmosTransactionLink,
  getEthAddressLink,
  getEthTransactionLink,
} from "../helpers";

const cantoTestnetBlockExplorerEVM = "https://testnet.tuber.build";

const cantoMainBlockExplorerCosmos = "https://althea.explorers.guru";
const cantoMainBlockExplorerEVM = "https://althea.explorers.guru";

// canto will have an EVM and COSMOS chain data
const cantoMainnetBaseInfo = {
  name: "Althea",
  icon: "/althea.svg",
  isTestChain: false,
  rpcUrl: "http://167.99.113.4:8545/",
  nativeCurrency: {
    name: "Althea",
    baseName: "aalthea",
    symbol: "ALTHEA",
    decimals: 18,
  },
};

export const CANTO_MAINNET_EVM: EVMNetwork = {
  ...cantoMainnetBaseInfo,
  id: "althea-mainnet",
  chainId: 417834,
  blockExplorer: {
    url: cantoMainBlockExplorerEVM,
    getAddressLink: getEthAddressLink(cantoMainBlockExplorerEVM),
    getTransactionLink: getEthTransactionLink(cantoMainBlockExplorerEVM),
  },
  multicall3Address: "0x951A0EF2cE10f92ea50fF55444203C0501486E2e",
};

export const CANTO_MAINNET_COSMOS: CosmosNetwork = {
  ...cantoMainnetBaseInfo,
  id: "althea-mainnet",
  chainId: "althea_417834-1",
  restEndpoint: "http://167.99.113.4:1317/",
  addressPrefix: "althea",
  checkAddress: function (address) {
    return checkCosmosAddress(this.addressPrefix)(address);
  },
  blockExplorer: {
    url: cantoMainBlockExplorerCosmos,
    getAddressLink: getCosmosAddressLink(cantoMainBlockExplorerCosmos),
    getTransactionLink: getCosmosTransactionLink(cantoMainBlockExplorerCosmos),
  },
};

// Testnet
const cantoTestnetBaseInfo = {
  name: "Canto Testnet",
  icon: "/icons/canto.svg",
  isTestChain: true,
  rpcUrl: "https://canto-testnet.plexnode.wtf",
  nativeCurrency: {
    name: "Canto",
    baseName: "acanto",
    symbol: "CANTO",
    decimals: 18,
  },
};
export const CANTO_TESTNET_EVM: EVMNetwork = {
  ...cantoMainnetBaseInfo,
  id: "althea-mainnet",
  chainId: 417834,
  blockExplorer: {
    url: cantoMainBlockExplorerEVM,
    getAddressLink: getEthAddressLink(cantoMainBlockExplorerEVM),
    getTransactionLink: getEthTransactionLink(cantoMainBlockExplorerEVM),
  },
  multicall3Address: "0x951A0EF2cE10f92ea50fF55444203C0501486E2e",
};

export const CANTO_TESTNET_COSMOS: CosmosNetwork = {
  ...cantoMainnetBaseInfo,
  id: "althea-mainnet",
  chainId: "althea_417834-1",
  restEndpoint: "http://167.99.113.4:1317/",
  addressPrefix: "althea",
  checkAddress: function (address) {
    return checkCosmosAddress(this.addressPrefix)(address);
  },
  blockExplorer: {
    url: cantoMainBlockExplorerCosmos,
    getAddressLink: getCosmosAddressLink(cantoMainBlockExplorerCosmos),
    getTransactionLink: getCosmosTransactionLink(cantoMainBlockExplorerCosmos),
  },
};

export const metamaskChainConfig = {
  chainId: `0x${parseInt(CANTO_MAINNET_EVM.chainId.toString()).toString(16)}`, 
  chainName: CANTO_MAINNET_EVM.name,
  nativeCurrency: CANTO_MAINNET_EVM.nativeCurrency,
  rpcUrls: [CANTO_MAINNET_EVM.rpcUrl],
  blockExplorerUrls: [CANTO_MAINNET_EVM.blockExplorer?.url],
};

export const chainConfig = {
  chainId: "althea_417834-1",
  chainName: "Althea",
  rpc: "http://167.99.113.4:26657/",
  rest: "http://167.99.113.4:1317/",

  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: "althea",
    bech32PrefixAccPub: "altheapub",
    bech32PrefixValAddr: "altheavaloper",
    bech32PrefixValPub: "altheasvaloperpub",
    bech32PrefixConsAddr: "altheavalcons",
    bech32PrefixConsPub: "altheavalconspub",
  },
  currencies: [
    {
      coinDenom: "ALTHEA",
      coinMinimalDenom: "aalthea",
      coinDecimals: 18,
      coinGeckoId: "althea",
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "ALTHEA",
      coinMinimalDenom: "aalthea",
      coinDecimals: 18,
      coinGeckoId: "althea",
    },
  ],
  stakeCurrency: {
    coinDenom: "ALTHEA",
    coinMinimalDenom: "aalthea",
    coinDecimals: 18,
    coinGeckoId: "althea",
  },
  coinType: 118,
  gasPriceStep: {
    low: 90000000000,
    average: 100000000000,
    high: 300000000000,
  },
};
