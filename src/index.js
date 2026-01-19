import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from 'notistack';
// const script = document.createElement('script');
// script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_API_KEY}&libraries=places`;
// script.async = true;
// script.defer = true;
// document.head.appendChild(script);
import $ from 'jquery';
window.$ = window.jQuery = $;
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <SnackbarProvider maxSnack={4}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </SnackbarProvider>
);
