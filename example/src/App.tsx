import { Layout } from "./components/layouts";
import { SwapForm } from "./components/SwapForm";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Layout className="flex flex-col h-screen w-screen">
      <ToastContainer
        aria-label="Toast container"
        theme="dark"
        position="bottom-right"
        autoClose={20000}
      />
      <SwapForm />
    </Layout>
  );
}

export default App;
