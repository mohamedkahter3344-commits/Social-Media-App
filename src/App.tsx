import { RouterProvider } from "react-router-dom";
import mainRouter from "./Routing/AppRoutes";
import { Toast } from "@heroui/react";
import TokenContextProvider from "./Context/TokenContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const App = () => {
  const queryClient = new QueryClient();
  return (
    <>
      <TokenContextProvider>
        <QueryClientProvider client={queryClient}>
          <Toast.Provider placement="top" />
          <RouterProvider router={mainRouter} />
        </QueryClientProvider>
      </TokenContextProvider>
    </>
  );
};

export default App;
