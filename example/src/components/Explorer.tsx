import { SquareArrowOutUpRight } from "lucide-react";
import { cn } from "../lib/utils";
import { truncateAddress } from "../utils";
import { CopyToClipboard } from "./CopyToClipboard";
import { toTxBlockExplorer } from "../utils/explorer";

interface ExplorerProps {
  label: string;
  value?: string;
  networkId?: string;
  type?: "tx" | "address";
  copyValue?: string;
  className?: string;
  isShowCopy?: boolean;
  isShowLink?: boolean;
}
export const Explorer = ({
  label,
  value,
  networkId,
  type = "tx",
  copyValue,
  className,
}: ExplorerProps) => {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <p className="text-white/48">{label ? `${label}:` : ""}</p>
      <a
        className="flex items-center gap-1 underline"
        target="_blank"
        href={toTxBlockExplorer(networkId || "", value || "", type)}
      >
        {truncateAddress(value || "")}
        <SquareArrowOutUpRight className="size-4 icon" />
      </a>
      <CopyToClipboard text={copyValue || value || ""}></CopyToClipboard>
    </div>
  );
};
