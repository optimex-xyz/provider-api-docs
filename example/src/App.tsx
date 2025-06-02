import { SwapForm } from "./components/SwapForm";
import { WalletConnect } from "./components/WalletConnect";
import { useWallet } from "./context";
import { ToastContainer } from "react-toastify";

function App() {
  const { btcAddress, evmAddress } = useWallet();
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <ToastContainer aria-label="Toast container" />
      <div className="flex justify-between items-center flex-col w-[600px] gap-4 mx-auto">
        <h2 className="text-3xl font-bold">Optimex Swap Demo</h2>
        <WalletConnect />
        {btcAddress && evmAddress ? <SwapForm /> : null}
      </div>
    </div>
  );
}

export default App;
