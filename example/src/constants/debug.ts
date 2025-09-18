export const IS_TRADE_TIMEOUT = !!new URLSearchParams(
  window.location.search
).get("timeout");
export const IS_ACROSS_EVM_REFUND = !!new URLSearchParams(
  window.location.search
).get("acrossEvmRefund");
export const IS_ACROSS_BTC_REFUND = !!new URLSearchParams(
  window.location.search
).get("acrossBtcToEvmRefundToAdmin");
export const IS_ACROSS_REFUND_FAIL = !!new URLSearchParams(
  window.location.search
).get("acrossEvmToBtcRefundToAdmin");
