import { RouterProvider } from "react-router-dom";
import mainRouter from "./Routing/AppRoutes";
import { Toast } from "@heroui/react";
import TokenContextProvider from "./Context/TokenContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const App = () => {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <TokenContextProvider>
          <Toast.Provider placement="top" />
          <RouterProvider router={mainRouter} />
        </TokenContextProvider>
      </QueryClientProvider>
    </>
  );
};

export default App;
