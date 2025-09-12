import App from "./App";
import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components";
import { PATHS } from "./constants/path";
import { SwapDetailPage } from "./pages/SwapDetail";

export const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        path: PATHS.HOME,
        element: <App />,
      },
      {
        path: `${PATHS.SWAP}/:tradeId`,
        element: <SwapDetailPage />,
      },
    ],
  },
]);
