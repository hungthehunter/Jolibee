import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { createRoot } from 'react-dom/client';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from './App.jsx';
import './index.css';
import { persistor, store } from "./redux/store.js";

const queryClient = new QueryClient() 
createRoot(document.getElementById('root')).render(
<QueryClientProvider client={queryClient}>
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
    <App />
    </PersistGate>
    </Provider>
    <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
)
