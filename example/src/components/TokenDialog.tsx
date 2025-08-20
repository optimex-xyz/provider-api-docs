import { useRef, useState } from "react";
import type { TokenInfo } from "../services/SwapService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface TokenDialogProps {
  trigger: React.ReactNode;
  tokens: TokenInfo[];
  onSelect: (token: TokenInfo) => void;
}

export const TokenDialog: React.FC<TokenDialogProps> = ({
  trigger,
  tokens,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger onClick={() => setOpen(true)} asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-thin">
            Select a Token
          </DialogTitle>
          <DialogDescription className="flex flex-col gap-4">
            {tokens.map((token) => (
              <div
                key={token.token_id}
                className="flex p-2 items-center gap-2 hover:bg-white/4 rounded-sm cursor-pointer"
                onClick={() => {
                  onSelect(token);
                  setOpen(false);
                }}
              >
                <img
                  src={token.token_logo_uri}
                  alt={token.token_symbol}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div>
                  <p className="text-white">{token.token_name}</p>
                  <p className="text-white/48 text-xs">{token.token_symbol}</p>
                </div>
              </div>
            ))}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
