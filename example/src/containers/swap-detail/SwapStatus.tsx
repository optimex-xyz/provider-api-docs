import { useMemo } from "react";
import {
  SwapState,
  type ISwapDetail,
  type TokenInfo,
} from "../../services/type";
import { useFindCanonicalToken, useFindToken } from "../../hooks";
import { Explorer } from "../../components/Explorer";
import { CircleCheckBig, CircleX, RefreshCw } from "lucide-react";
import { formatTokenAmount } from "../../utils";
import { Block } from "../../components";

interface SwapStatusProps {
  data: ISwapDetail;
}

const SWAP_STATE_GROUPS = {
  DEPOSIT: [
    SwapState.UserConfirmed,
    SwapState.ReadyToSubmitToL2,
    SwapState.L2SubmissionStarted,
    SwapState.TradeInfoSubmittedToL2,
  ],
  DEPOSIT_CONFIRMED: [SwapState.DepositConfirmed],
  SWAPPING: [
    SwapState.RequestForCommitmentStarted,
    SwapState.Committed,
    SwapState.WaitToRetryCommit,
    SwapState.StartedCommitmentSubmissionToL2,
  ],
  PAYMENT: [SwapState.ReadyForPayment, SwapState.PaymentBundleSubmitted],
  DONE: [SwapState.Done, SwapState.PaymentConfirmed],
  FAILED: [
    SwapState.Failed,
    SwapState.UserCancelled,
    SwapState.Failure,
    SwapState.ToBeAborted,
    SwapState.Aborted,
  ],
} as const;

interface StatusStepProps {
  isCompleted: boolean;
  isInProgress: boolean;
  title: string | React.ReactNode;
  children?: React.ReactNode;
  isFailed?: boolean;
}

const StatusStep = ({
  isCompleted,
  isInProgress,
  title,
  children,
  isFailed,
}: StatusStepProps) => {
  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-center">
        {isCompleted ? (
          <CircleCheckBig className="size-4 text-green-500" />
        ) : isFailed ? (
          <CircleX className="size-4 text-red-500" />
        ) : (
          <RefreshCw
            className={`size-4 text-orange-500 ${
              isInProgress ? "animate-spin" : ""
            }`}
          />
        )}
        <span>{title}</span>
      </div>

      <div>{children}</div>
    </div>
  );
};

interface DepositStepProps {
  amountIn: string;
  fromToken: TokenInfo | undefined;
  data: ISwapDetail;
  isConfirmed: boolean;
}

const DepositStep = ({
  amountIn,
  fromToken,
  data,
  isConfirmed,
}: DepositStepProps) => {
  const { getCanonicalToken } = useFindCanonicalToken();
  let networkId = fromToken?.network_id;
  if (!fromToken) return null;
  if (fromToken.swap_type === "bridge") {
    const canonicalToken = getCanonicalToken(fromToken.canonical_token_id);
    networkId = canonicalToken?.network_id;
  }
  return (
    <div>
      <StatusStep
        isCompleted={isConfirmed}
        isInProgress={!isConfirmed}
        title={
          <div className="flex gap-1 items-center">
            <span className="text-white/48">
              {isConfirmed ? "Sent" : "Sending"} {amountIn}{" "}
            </span>
            {fromToken.token_symbol}{" "}
            <span className="text-white/48">to Trading Vault</span>
            <Explorer
              label=""
              value={data.deposit_vault}
              networkId={networkId}
              type="address"
            />
          </div>
        }
      ></StatusStep>
      {data.user_deposit_tx && (
        <Explorer
          label="Tx hash"
          value={data.user_deposit_tx}
          networkId={networkId}
          type="tx"
          className="ml-6"
        />
      )}
    </div>
  );
};

interface SwapStepProps {
  fromToken: TokenInfo | undefined;
  toToken: TokenInfo | undefined;
  amountIn: string;
  amountOut: string;
  isCompleted: boolean;
}

const SwapStep = ({
  fromToken,
  toToken,
  amountIn,
  amountOut,
  isCompleted,
}: SwapStepProps) => {
  if (!fromToken || !toToken) return null;

  return (
    <StatusStep
      isCompleted={isCompleted}
      isInProgress={!isCompleted}
      title={
        <div>
          <span className="text-white/48">
            {isCompleted ? "Swapped" : "Swapping"}
          </span>{" "}
          {amountIn}
          {fromToken.token_symbol} <span className="text-white/48">to</span>{" "}
          {amountOut} {toToken.token_symbol}
        </div>
      }
    />
  );
};

interface ReceiveStepProps {
  toToken: TokenInfo | undefined;
  data: ISwapDetail;
  amountOut: string;
  isConfirmed: boolean;
}

const ReceiveStep = ({
  toToken,
  data,
  amountOut,
  isConfirmed,
}: ReceiveStepProps) => {
  if (!toToken) return null;

  return (
    <StatusStep
      isCompleted={isConfirmed}
      isInProgress={!isConfirmed}
      title={
        <div>
          <span className="text-white/48">
            {isConfirmed ? "Received" : "Receiving"}
          </span>{" "}
          {amountOut} {toToken.token_symbol}
        </div>
      }
    >
      {data.payment_bundle.settlement_tx &&
        toToken.network_id !== "bitcoin_testnet" && (
          <Explorer
            label="Tx hash:"
            value={data.payment_bundle.settlement_tx}
            networkId={toToken.network_id}
            type="tx"
            className="ml-6"
          />
        )}
    </StatusStep>
  );
};

const FailedStep = () => {
  return (
    <div className="text-red-500">
      <StatusStep
        isCompleted={false}
        isInProgress={false}
        isFailed={true}
        title="Transaction Failed"
      />
    </div>
  );
};

const isStateInGroup = (
  state: SwapState,
  group: readonly SwapState[]
): boolean => {
  return group.includes(state);
};

export const SwapStatus = ({ data }: SwapStatusProps) => {
  const { data: fromToken } = useFindToken(
    data.from_token.token_id,
    data.from_token.chain
  );
  const { data: toToken } = useFindToken(
    data.to_token.token_id,
    data.to_token.chain
  );

  const { amountIn, amountOut } = useMemo(() => {
    const amountIn = formatTokenAmount(
      data.amount_before_fees,
      fromToken?.token_decimals
    );
    const amountOut = formatTokenAmount(
      data.receiving_amount,
      toToken?.token_decimals
    );
    return { amountIn, amountOut };
  }, [
    data.amount_before_fees,
    data.receiving_amount,
    fromToken?.token_decimals,
    toToken?.token_decimals,
  ]);

  const renderStatusSteps = useMemo(() => {
    const state = data.state;
    if (isStateInGroup(state, SWAP_STATE_GROUPS.FAILED)) {
      return <FailedStep />;
    }
    if (isStateInGroup(state, SWAP_STATE_GROUPS.DEPOSIT)) {
      return (
        <DepositStep
          amountIn={amountIn}
          fromToken={fromToken}
          data={data}
          isConfirmed={false}
        />
      );
    }

    if (
      isStateInGroup(state, SWAP_STATE_GROUPS.DEPOSIT_CONFIRMED) ||
      isStateInGroup(state, SWAP_STATE_GROUPS.SWAPPING)
    ) {
      return (
        <div className="space-y-4">
          <DepositStep
            amountIn={amountIn}
            fromToken={fromToken}
            data={data}
            isConfirmed={true}
          />
          <SwapStep
            fromToken={fromToken}
            toToken={toToken}
            amountIn={amountIn}
            amountOut={amountOut}
            isCompleted={false}
          />
        </div>
      );
    }

    if (isStateInGroup(state, SWAP_STATE_GROUPS.PAYMENT)) {
      return (
        <div className="space-y-4">
          <DepositStep
            amountIn={amountIn}
            fromToken={fromToken}
            data={data}
            isConfirmed={true}
          />
          <SwapStep
            fromToken={fromToken}
            toToken={toToken}
            amountIn={amountIn}
            amountOut={amountOut}
            isCompleted={true}
          />
          <ReceiveStep
            toToken={toToken}
            data={data}
            amountOut={amountOut}
            isConfirmed={false}
          />
        </div>
      );
    }

    if (isStateInGroup(state, SWAP_STATE_GROUPS.DONE)) {
      return (
        <div className="space-y-4">
          <DepositStep
            amountIn={amountIn}
            fromToken={fromToken}
            data={data}
            isConfirmed={true}
          />
          <SwapStep
            fromToken={fromToken}
            toToken={toToken}
            amountIn={amountIn}
            amountOut={amountOut}
            isCompleted={true}
          />
          <ReceiveStep
            toToken={toToken}
            data={data}
            amountOut={amountOut}
            isConfirmed={true}
          />
        </div>
      );
    }

    return null;
  }, [data, fromToken, toToken, amountIn, amountOut]);

  return <Block className="w-full">{renderStatusSteps}</Block>;
};
