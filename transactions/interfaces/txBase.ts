import { ContractAbi } from "web3-types";
import { CantoFETxType, TransactionStatus, UnsignedCosmosMessages } from ".";
import { PromiseWithError, ReturnWithError } from "@/config/interfaces/errors";
import { NewTransactionFlowPlaceholder } from "../flows";
import { BridgingMethod } from "../bridge";

export interface TransactionDescription {
  title: string;
  description: string;
}

export type BridgeProgress = {
  type: BridgingMethod;
  lastStatus: TransactionStatus;
  timeLeft?: number;
  direction: "in" | "out";
  amountFormatted: string;
  showInProgress: boolean;
};

export type Transaction = {
  // account address that will be used to sign the transaction
  fromAddress: string;
  // chainId the wallet must be on to perform the transaction
  chainId: number | string;
  description: TransactionDescription;
  feTxType: CantoFETxType;
  bridge?: BridgeProgress;
  verifyTxComplete?: (txHash: string) => PromiseWithError<boolean>;
  cosmosMsg?: {typeUrl: string, value: any} | {typeUrl: string, value: any};
} & (
  | {
      type: "EVM";
      target: string;
      abi: ContractAbi;
      method: string;
      params: unknown[];
      value: string;
    }
  | {
      type: "COSMOS";
      msg: UnsignedCosmosMessages;
    }
    | {
      type: "KEPLR";
      tx: () => PromiseWithError<unknown>;
      getHash: (...args: any[]) => ReturnWithError<string>;
      msgParams?: any; 
    }
);

export type MultiMessageTransaction = {
  // account address that will be used to sign the transaction
  fromAddress: string;
  // chainId the wallet must be on to perform the transaction
  chainId: number | string;
  description: TransactionDescription;
  feTxType: CantoFETxType;
  bridge?: BridgeProgress;
  verifyTxComplete?: (txHash: string) => PromiseWithError<boolean>;
} & (
  | {
      type: "EVM";
      target: string;
      abi: ContractAbi;
      method: string;
      params: unknown[];
      value: string;
    }
  | {
      type: "COSMOS";
      msg: UnsignedCosmosMessages[];
    }
  | {
      type: "KEPLR";
      tx: () => PromiseWithError<unknown>;
      getHash: (...args: any[]) => ReturnWithError<string>;
    }
);

// interface to use for functions that return transactions ready for the txStore
export interface TxCreatorFunctionReturn {
  transactions?: Transaction[];
  multiMessageTransactions?: MultiMessageTransaction[];
  extraFlow?: NewTransactionFlowPlaceholder;
}
