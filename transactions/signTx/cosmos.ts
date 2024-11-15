import { Transaction } from "../interfaces";
import { NEW_ERROR, NO_ERROR, PromiseWithError } from "@/config/interfaces";
import { useChain } from "@cosmos-kit/react";
import { useTx } from "@/hooks/cosmos/useTx";
import { SignerData } from "@cosmjs/stargate";

export async function signCosmosTx(
  tx: Transaction,
  signerData: SignerData
): PromiseWithError<string> {
  try {
    const { address, getSigningStargateClient } = useChain("althea");
    
    if (!address) {
      throw new Error("No Cosmos wallet connected");
    }

    const { tx: executeTx, transactionHash } = useTx("althea", signerData);
    
    // Execute the transaction
    await executeTx([tx.cosmosMsg ?? {} as Msg], {
      fee: tx.fee,
      memo: tx.memo ?? "",
      onSuccess: () => {
        console.log("Transaction successful");
      },
    });

    if (!transactionHash) {
      throw new Error("Transaction failed - no hash returned");
    }

    return NO_ERROR(transactionHash);
  } catch (err) {
    return NEW_ERROR("signCosmosTx", err);
  }
}
