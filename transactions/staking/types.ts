import { ValidatorWithDelegations } from "@/hooks/staking/interfaces/validators";
import BigNumber from "bignumber.js";

export enum StakingTxTypes {
  DELEGATE = "Delegate",
  UNDELEGATE = "Undelegate",
  REDELEGATE = "Redelegate",
  CLAIM_REWARDS = "Claim Rewards",
  MULTI_STAKE = "Multi Stake",
  MULTI_UNSTAKE = "Multi Unstake",
}

export type StakingTransactionParams = {
  chainId: number;
  ethAccount: string;
  cosmos?: boolean;
} & (
  | {
      txType: StakingTxTypes.DELEGATE | StakingTxTypes.UNDELEGATE;
      validator: ValidatorWithDelegations;
      amount: string;
      nativeBalance: string;
    }
  | {
      txType: StakingTxTypes.REDELEGATE;
      validator: ValidatorWithDelegations;
      amount: string;
      newValidatorAddress: string;
      newValidatorName?: string;
      nativeBalance: string;
    }
  | {
      txType: StakingTxTypes.CLAIM_REWARDS;
      validatorAddresses: string[];
      nativeBalance: string;
    }
  | {
      txType: StakingTxTypes.MULTI_STAKE | StakingTxTypes.MULTI_UNSTAKE;
      validators?: {
        validatorAddress: string;
        amount: BigNumber;
      }[];
      undelegate: boolean;
      nativeBalance: string;
    }
);
