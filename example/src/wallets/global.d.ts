import type { UnisatProvider } from "./unisat.type";

declare global {
  interface Window {
    unisat_wallet?: UnisatProvider;
  }
}
