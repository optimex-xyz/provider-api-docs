export interface SwapQuote {
  session_id: string;
  best_quote: string;
  best_quote_after_fees: string;
  protocol_fee: number;
  pmm_finalists: Array<{
    pmm_id: string;
    pmm_receiving_address: string;
  }>;
  error?: string;
  message?: string;
  statusCode: number;
}

export interface TokenInfo {
  token_id: string;
  token_symbol: string;
  token_decimals: number;
  network_name: string;
  token_address: string;
  network_type: "BTC" | "EVM";
  network_id: string;
  token_logo_uri: string;
  network_logo_uri: string;
  token_name: string;
  chain_id: string;
  canonical_token_id: string;
  swap_type: "bridge" | "direct";
}

export interface NetworkInfo {
  network_id: string;
  name: string;
  logo_uri: string;
  symbol: string;
  type: string;
}

export interface InitiateTradeResponse {
  trade_id: string;
  deposit_address: string;
  payload: string;
}

export interface InitTradePayload {
  from_token_id: string;
  to_token_id: string;
  from_user_address: string;
  to_user_address: string;
  user_refund_address: string;
  user_refund_pubkey: string;
  creator_public_key: string;
  from_wallet_address: string;
  affiliate_info: Array<{
    provider: string;
    rate: string;
    receiver: string;
    network: string;
  }>;
  session_id: string;
  amount_in: string;
  min_amount_out: string;
  trade_timeout?: number;
  script_timeout?: number;
  across_btc_refund?: string;
  across_refund_fail?: string;
}

export interface IGetQuotePayload {
  from_token_id: string;
  to_token_id: string;
  from_token_amount: string;
  affiliate_fee_bps: string;
  from_user_address: string;
  to_user_address: string;
  user_refund_address: string;
}

export interface IGetAvailableTokensResponse {
  tokens: TokenInfo[];
  supported_networks: NetworkInfo[];
}

export const SwapState = {
  Init: "Init",
  Indicated: "Indicated",
  UserConfirmed: "UserConfirmed",
  ReadyToSubmitToL2: "ReadyToSubmitToL2",
  L2SubmissionStarted: "L2SubmissionStarted",
  TradeInfoSubmittedToL2: "TradeInfoSubmittedToL2",
  DepositConfirmed: "DepositConfirmed",
  RequestForCommitmentStarted: "RequestForCommitmentStarted",
  Committed: "Committed",
  WaitToRetryCommit: "WaitToRetryCommit",
  StartedCommitmentSubmissionToL2: "StartedCommitmentSubmissionToL2",
  ReadyForPayment: "ReadyForPayment",
  Failed: "Failed",
  UserCancelled: "UserCancelled",
  PaymentBundleSubmitted: "PaymentBundleSubmitted",
  PaymentConfirmed: "PaymentConfirmed",
  Done: "Done",
  Failure: "Failure",
  ToBeAborted: "ToBeAborted",
  Aborted: "Aborted",
} as const;

export type SwapState = (typeof SwapState)[keyof typeof SwapState];

export interface ISwapDetail {
  swap_type: string;
  is_liquidation: boolean;
  trade_id: string;
  session_id: string;
  solver_address: string;
  from_token: IFromToken;
  to_token: IToToken;
  amount_before_fees: string;
  amount_after_fees: string;
  from_user_address: string;
  user_receiving_address: string;
  script_timeout: number;
  protocol_fee_in_bps: string;
  affiliate_fee_in_bps: string;
  total_fee: string;
  protocol_fee: string;
  affiliate_fee: string;
  is_cancelable: boolean;
  mpc_asset_chain_pubkey: string;
  best_indicative_quote: string;
  display_indicative_quote: string;
  pmm_finalists: PmmFinalist[];
  settlement_quote: string;
  receiving_amount: string;
  selected_pmm: string;
  selected_pmm_receiving_address: string;
  selected_pmm_operator: string;
  selected_pmm_sig_deadline: number;
  commitment_retries: number;
  pmm_failure_stats: PmmFailureStats;
  commited_signature: string;
  min_amount_out: any;
  trade_timeout: number;
  user_deposit_tx: string;
  deposit_vault: string;
  payment_bundle: PaymentBundle;
  user_signature: string;
  submit_deposit_tx: string;
  trade_submission_tx: string;
  trade_select_pmm_tx: string;
  trade_make_payment_tx: string;
  refund_tx: string;
  state: SwapState;
  last_update_msg: string;
  version: number;
}

export interface IFromToken {
  token_id: string;
  chain: string;
  address: string;
  fee_in: boolean;
  fee_out: boolean;
}

export interface IToToken {
  token_id: string;
  chain: string;
  address: string;
  fee_in: boolean;
  fee_out: boolean;
}

export interface PmmFinalist {
  pmm_id: string;
  pmm_receiving_address: string;
}

export interface PmmFailureStats {}

export interface PaymentBundle {
  trade_ids: string[];
  settlement_tx: string;
  signature: string;
  start_index: number;
  pmm_id: string;
  signed_at: number;
}
