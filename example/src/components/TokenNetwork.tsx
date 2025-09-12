import type { TokenInfo } from "../services/type";

interface TokenNetworkProps {
  token: TokenInfo;
}
export const TokenNetwork = ({ token }: TokenNetworkProps) => {
  if (!token) return null;
  return (
    <div className="relative w-10">
      <img
        src={token.token_logo_uri}
        alt={token.token_symbol}
        width={32}
        height={32}
        className="rounded-full"
      />
      <img
        src={token.network_logo_uri}
        alt={token.network_name}
        width={16}
        height={16}
        className="rounded-full absolute bottom-0 -right-0 border border-white/50"
      />
    </div>
  );
};
