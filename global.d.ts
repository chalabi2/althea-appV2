import { Window as KeplrWindow } from "@keplr-wallet/types";
declare global {
  interface Window extends KeplrWindow {
    ethereum: any;
    keplr?: any;
    cosmostation?: any;
    leap?: any;
    getOfflineSigner?: any;
  }
}
