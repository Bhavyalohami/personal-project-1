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

const getPublicPathname = () => {
  const publicUrl = process.env.PUBLIC_URL;
  if (!publicUrl) return "";
  try {
    return new URL(publicUrl).pathname.replace(/\/$/, "");
  } catch {
    return publicUrl.replace(/\/$/, "");
  }
};

const publicPathname = getPublicPathname();
const routerBasename =
  publicPathname && window.location.pathname.startsWith(publicPathname)
    ? publicPathname
    : undefined;

const normalizePublicAssetImages = () => {
  if (!publicPathname) return;

  document.querySelectorAll('img[src^="/brand/"]').forEach((image) => {
    const src = image.getAttribute("src");
    if (src && !src.startsWith(publicPathname)) {
      image.setAttribute("src", `${publicPathname}${src}`);
    }
  });
};

normalizePublicAssetImages();
new MutationObserver(normalizePublicAssetImages).observe(document.documentElement, {
  childList: true,
  subtree: true,
});

root.render(
  <SnackbarProvider maxSnack={4}>
    <BrowserRouter basename={routerBasename}>
      <App />
    </BrowserRouter>
  </SnackbarProvider>
);
