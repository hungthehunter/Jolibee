import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { StrictMode } from "react";
import { createRoot } from 'react-dom/client';
import { Provider } from "react-redux";
import App from './App.jsx';
import './index.css';
import store from "./redux/store.js";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </StrictMode>,
)
