import React from "react";
import type { TokenInfo } from "../services/SwapService";

interface TokenSelectProps {
  tokens: TokenInfo[];
  value: TokenInfo | null;
  onChange: (token: TokenInfo | null) => void;
  placeholder?: string;
}

export const TokenSelect: React.FC<TokenSelectProps> = ({
  tokens,
  value,
  onChange,
  placeholder = "Select token",
  ...selectProps
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const token = tokens.find((token) => token.token_id === e.target.value);
    onChange(token || null);
  };

  return (
    <select
      className="flex-1 px-2 py-2 border border-gray-200 rounded-md text-base focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
      value={value?.token_id || ""}
      onChange={handleChange}
      {...selectProps}
    >
      {tokens.map((token) => (
        <option key={token.token_id} value={token.token_id}>
          {token.token_symbol} ({token.network_name})
        </option>
      ))}
    </select>
  );
};
