import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import FilePage from "./pages/FilePage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

export const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/file/:fileId",
    element: <FilePage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
