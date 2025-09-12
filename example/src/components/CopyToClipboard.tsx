import React from "react";
import { toast } from "react-toastify";
import { useCopyToClipboard } from "../hooks";
import { Copy } from "lucide-react";

interface CopyToClipboardProps extends React.ComponentProps<"div"> {
  text: string;
  copiedSuccessMessage?: string;
  copiedFailMessage?: string;
  stopPropagation?: boolean;
}

export function CopyToClipboard({
  text,
  copiedSuccessMessage = "Copied",
  copiedFailMessage = "Copy Failed",
  stopPropagation = false,
  ...rest
}: CopyToClipboardProps) {
  const [_, copy] = useCopyToClipboard();

  const handleCopy = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (stopPropagation) e.stopPropagation();
    const success = await copy(text);
    if (success) {
      toast.success(copiedSuccessMessage);
    } else {
      toast.error(copiedFailMessage);
    }
  };

  return (
    <div className="cursor-pointer" onClick={handleCopy} {...rest}>
      <Copy className="size-4 ml-1" />
    </div>
  );
}
