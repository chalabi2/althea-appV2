import {
  NEW_ERROR,
  NO_ERROR,
  PromiseWithError,
  Validation,
} from "@/config/interfaces";
import { StakingTransactionParams, StakingTxTypes } from "./types";
import {
  createMsgsDelegate,
  createMultiMsgsDelegate,
} from "@/transactions/cosmos/messages/staking/delegate";
import { createMsgsRedelegate } from "@/transactions/cosmos/messages/staking/redelegate";
import { createMsgsClaimStakingRewards } from "@/transactions/cosmos/messages/staking/claimRewards";

import { displayAmount } from "@/utils/formatting/balances.utils";
import {
  CantoFETxType,
  TX_DESCRIPTIONS,
} from "@/transactions/interfaces/txDescriptions";
import {
  MultiMessageTransaction,
  Transaction,
  TransactionDescription,
  TxCreatorFunctionReturn,
} from "@/transactions/interfaces";
import {
  checkCantoPubKey,
  ethToAltheaAddress,
  isValidEthAddress,
} from "@/utils/address";
import { TX_ERROR_TYPES, TX_PARAM_ERRORS } from "@/config/consts/errors";
import { validateWeiUserInputTokenAmount } from "@/utils/math";
import { ethToAlthea } from "@gravity-bridge/address-converter";
import {
  CLAIM_STAKING_REWARD_FEE,
  DELEGATE_FEE,
  REDELEGATE_FEE,
  UNDELEGATE_FEE,
} from "@/config/consts/fees";
import BigNumber from "bignumber.js";
import { CANTO_MAINNET_EVM } from "@/config/networks";
import { generateCantoPublicKeyWithTx } from "../cosmos/publicKey";

function createCosmosMsg(txParams: StakingTransactionParams) {
  switch (txParams.txType) {
    case StakingTxTypes.CLAIM_REWARDS:
      return txParams.validatorAddresses.map(validatorAddress => ({
        typeUrl: "/cosmos.distribution.v1beta1.MsgClaimDelegationRewards",
        value: MsgClaimDelegationRewards.fromPartial({
          delegatorAddress: txParams.ethAccount,
          validatorAddress: validatorAddress,
        }),
      }));
    // Add other cases for different transaction types in the future
    default:
      return null;
  }
}

export async function stakingTx(
  txParams: StakingTransactionParams
): PromiseWithError<TxCreatorFunctionReturn> {

  // convert user eth address into althea address
  const altheaAddress = ethToAlthea(txParams.ethAccount);

  /** create transaction list */
  const txList: Transaction[] = [];

  /** check if user has public key */
  const { data: hasPubKey, error: checkPubKeyError } = await checkCantoPubKey(
    altheaAddress,
    CANTO_MAINNET_EVM.chainId
  );
  if (!txParams || !txParams.ethAccount) {
    return NEW_ERROR(
      "Invalid transaction parameters or Ethereum address is missing."
    );
  }

  // switch based on tx type
  switch (txParams.txType) {
    case StakingTxTypes.DELEGATE:
      if (!checkPubKeyError || hasPubKey) {
        txList.push(
          _delegateTx(
            txParams.ethAccount,
            txParams.chainId,
            altheaAddress,
            txParams.validator.operator_address,
            txParams.amount,
            false,
            TX_DESCRIPTIONS.DELEGATE(
              txParams.validator.description.moniker,
              displayAmount(txParams.amount, 18),
              false
            )
          )
        );
      }
      return NO_ERROR({ transactions: txList });
    case StakingTxTypes.UNDELEGATE:
      return NO_ERROR({
        transactions: [
          _delegateTx(
            txParams.ethAccount,
            txParams.chainId,
            altheaAddress,
            txParams.validator.operator_address,
            txParams.amount,
            txParams.txType === StakingTxTypes.UNDELEGATE,
            TX_DESCRIPTIONS.DELEGATE(
              txParams.validator.description.moniker,
              displayAmount(txParams.amount, 18),
              txParams.txType === StakingTxTypes.UNDELEGATE
            )
          ),
        ],
      });
    case StakingTxTypes.REDELEGATE:
      return NO_ERROR({
        transactions: [
          _redelegateTx(
            txParams.ethAccount,
            txParams.chainId,
            altheaAddress,
            txParams.validator.operator_address,
            txParams.newValidatorAddress,
            txParams.amount,
            TX_DESCRIPTIONS.REDELEGATE(
              txParams.validator.description.moniker,
              txParams.newValidatorName ?? "",
              displayAmount(txParams.amount, 18)
            )
          ),
        ],
      });
    case StakingTxTypes.CLAIM_REWARDS:
      return NO_ERROR({
        transactions: [
          _claimRewardsTx(
            txParams.ethAccount,
            txParams.chainId,
            altheaAddress,
            txParams.validatorAddresses,
            TX_DESCRIPTIONS.CLAIM_STAKING_REWARDS()
          ),
        ],
      });
    case StakingTxTypes.MULTI_STAKE:
      if (!txParams.validators || !txParams.validators.length) {
        return NEW_ERROR("No validators provided for MULTI_STAKE transaction.");
      }
      return NO_ERROR({
        multiMessageTransactions: [
          _delegateMultipleTx(
            txParams.ethAccount,
            txParams.chainId,
            altheaAddress,
            txParams.undelegate,
            // @ts-ignore
            txParams.validators,
            TX_DESCRIPTIONS.MULTI_STAKE(
              txParams.validators.length.toString(),
              txParams.validators
                .map((v) => displayAmount(v.amount, 18))
                .join(", "),
              false
            )
          ),
        ],
      });
    default:
      return NEW_ERROR("stakingTx::tx type not found");
  }
}

/**
 * TRANSACTION CREATORS
 * WILL NOT CHECK FOR VALIDITY OF PARAMS, MUST DO THIS BEFORE USING THESE CONSTRUCTORS
 */
const _delegateTx = (
  ethAddress: string,
  chainId: number,
  delegatorCantoAddress: string,
  validatorAddress: string,
  amount: string,
  undelegate: boolean,
  description: TransactionDescription
): Transaction => ({
  fromAddress: ethAddress,
  feTxType: undelegate ? CantoFETxType.UNDELEGATE : CantoFETxType.DELEGATE,
  description,
  chainId: chainId,
  type: "COSMOS",
  msg: createMsgsDelegate({
    delegatorCantoAddress,
    validatorAddress,
    amount,
    denom: "aalthea",
    undelegate,
  }),
});

const _delegateMultipleTx = (
  ethAddress: string,
  chainId: number,
  delegatorCantoAddress: string,
  undelegate: boolean,
  validatorsInfo: {
    validatorAddress: string;
    amount: string;
  }[],
  description: TransactionDescription
): MultiMessageTransaction => ({
  fromAddress: ethAddress,
  feTxType: CantoFETxType.MULTI_STAKE,
  description,
  chainId: chainId,
  type: "COSMOS",
  msg: createMultiMsgsDelegate([
    {
      delegatorCantoAddress,
      messages: validatorsInfo.map(({ validatorAddress, amount }) => ({
        validatorAddress,
        amount,
        denom: "aalthea",
        undelegate,
      })),
    },
  ]),
});

const _redelegateTx = (
  ethAddress: string,
  chainId: number,
  delegatorCantoAddress: string,
  validatorSrcAddress: string,
  validatorDstAddress: string,
  amount: string,
  description: TransactionDescription
): Transaction => ({
  fromAddress: ethAddress,
  description,
  chainId: chainId,
  feTxType: CantoFETxType.REDELEGATE,
  type: "COSMOS",
  msg: createMsgsRedelegate({
    delegatorCantoAddress,
    validatorSrcAddress,
    validatorDstAddress,
    amount,
    denom: "aalthea",
  }),
});

const _claimRewardsTx = (
  ethAddress: string,
  chainId: number,
  delegatorCantoAddress: string,
  validatorAddresses: string[],
  description: TransactionDescription
): Transaction => ({
  fromAddress: ethAddress,
  feTxType: CantoFETxType.CLAIM_STAKING_REWARDS,
  description,
  chainId: chainId,
  type: "COSMOS",
  msg: createMsgsClaimStakingRewards({
    delegatorCantoAddress,
    validatorAddresses,
  }),
});

export function validateStakingTxParams(
  txParams: StakingTransactionParams
): Validation {
  const isCosmosWallet = txParams.cosmos;

  // Common validations
  if (!isCosmosWallet && !isValidEthAddress(txParams.ethAccount)) {
    return {
      error: true,
      reason: TX_PARAM_ERRORS.PARAM_INVALID("ethAccount"),
    };
  }

  // switch depending on tx type
  switch (txParams.txType) {
    case StakingTxTypes.DELEGATE:
      if (BigNumber(txParams.nativeBalance).isLessThan(DELEGATE_FEE.amount)) {
        return {
          error: true,
          reason: TX_ERROR_TYPES.NOT_ENOUGH_NATIVE_BALANCE_STAKING,
        };
      }
      // amount just has to be less than canto balance
      return validateWeiUserInputTokenAmount(
        txParams.amount,
        "1",
        maxDelegateAmount(txParams.nativeBalance),
        "CANTO",
        18
      );
    case StakingTxTypes.MULTI_STAKE:
      // amount just has to be less than canto balance
      return validateWeiUserInputTokenAmount(
        txParams.validators?.map((v) => v.amount).join("") ?? "",
        "1",
        txParams.nativeBalance,
        "CANTO",
        18
      );
    case StakingTxTypes.UNDELEGATE:
      if (BigNumber(txParams.nativeBalance).isLessThan(UNDELEGATE_FEE.amount)) {
        return {
          error: true,
          reason: TX_ERROR_TYPES.NOT_ENOUGH_NATIVE_BALANCE_STAKING,
        };
      }
      // just need to make sure amount is less than user delegation balance
      return validateWeiUserInputTokenAmount(
        txParams.amount,
        "1",
        txParams.validator.userDelegation.balance,
        "CANTO",
        18
      );
    case StakingTxTypes.REDELEGATE: {
      if (BigNumber(txParams.nativeBalance).isLessThan(REDELEGATE_FEE.amount)) {
        return {
          error: true,
          reason: TX_ERROR_TYPES.NOT_ENOUGH_NATIVE_BALANCE_STAKING,
        };
      }
      //make sure newValidatorAddress is different than validatorAddress
      if (txParams.validator.operator_address == txParams.newValidatorAddress) {
        return { error: true, reason: "Same validator Addresses provided" };
      }
      if (txParams.newValidatorAddress == "") {
        return { error: true, reason: "No validator address provided" };
      }
      // make sure amount is less than user delegation balance
      return validateWeiUserInputTokenAmount(
        txParams.amount,
        "1",
        txParams.validator.userDelegation.balance,
        "CANTO",
        18
      );
    }
    case StakingTxTypes.CLAIM_REWARDS: {
      const minBalance = isCosmosWallet 
        ? CLAIM_STAKING_REWARD_FEE.amount // Adjust this constant for Cosmos if needed
        : CLAIM_STAKING_REWARD_FEE.amount;

      if (BigNumber(txParams.nativeBalance).isLessThan(minBalance)) {
        return {
          error: true,
          reason: TX_ERROR_TYPES.NOT_ENOUGH_NATIVE_BALANCE_STAKING,
        };
      }

      // Add any Cosmos-specific validations here if needed

      return { error: false };
    }
    default:
      return { error: true, reason: "reason: tx type not found" };
  }
}

// function to get max delegate amount
const maxDelegateAmount = (balance: string) => {
  const updatedBalance = BigNumber(balance).minus(DELEGATE_FEE.amount);
  return updatedBalance.isNegative() ? "0" : updatedBalance.toString();
};
