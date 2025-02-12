type BondStatus =
  | "BOND_STATUS_UNSPECIFIED"
  | "BOND_STATUS_UNBONDED"
  | "BOND_STATUS_UNBONDING"
  | "BOND_STATUS_BONDED";
export interface Validator {
  operator_address: string;
  jailed: boolean;
  status: BondStatus;
  tokens: string;
  consensus_pubkey: string;
  token_ratio: string;
  description: {
    moniker: string;
    identity?: string;
    website?: string;
    security_contact?: string;
    details?: string;
  };
  commission: string;
  rank: number;
}
export interface ValidatorWithDelegations extends Validator {
  userDelegation: {
    balance: string;
    rewards: string;
  };
}

export interface UnbondingDelegation {
  delegator_address: string;
  validator_address: string;
  creation_height: number;
  completion_date: string;
  initial_balance: string;
  balance: string;
}

export interface UserStakingReturn {
  delegations: DelegationResponse[] | null;
  unbondingDelegations: UnbondingDelegationResponse[] | null;
  rewards: DelegationRewardResponse;
}

/**
 * @notice Response type for querying user delegations
 */
interface DelegationResponse {
  balance: {
    denom: string;
    amount: string;
  };
  delegation: {
    delegator_address: string;
    shares: string;
    validator_address: string;
  };
}

/**
 * @notice Response type for querying user unbonding delegations
 */
interface UnbondingDelegationResponse {
  delegator_address: string;
  validator_address: string;
  creation_height: number;
  completion_time: string;
  initial_balance: string;
  balance: string;
}
[];

/**
 * @notice Response type for querying user rewards
 */
interface DelegationRewardResponse {
  rewards: {
    validator_address: string;
    reward: {
      denom: string;
      amount: string;
    }[];
  }[];
  total: {
    denom: string;
    amount: string;
  }[];
}
