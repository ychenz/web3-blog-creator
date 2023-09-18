import React from "react";
import ReactDOM from "react-dom/client";
import { MoralisProvider } from "react-moralis";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import { ManageBlog } from "./pages/ManageBlog";
import reportWebVitals from "./reportWebVitals";

const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 10000 } },
});

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <MoralisProvider initializeOnMount={false}>
                {/* Routed app */}
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<App />} />
                        <Route path="/manage/:siteCid" element={<ManageBlog />} />
                    </Routes>
                </BrowserRouter>
            </MoralisProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
