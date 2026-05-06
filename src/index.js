import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { SnackbarProvider } from 'notistack';
import { installStaticApiFallback } from "./Api/staticApiFallback";
// const script = document.createElement('script');
// script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_API_KEY}&libraries=places`;
// script.async = true;
// script.defer = true;
// document.head.appendChild(script);
import $ from 'jquery';
window.$ = window.jQuery = $;
const root = ReactDOM.createRoot(document.getElementById("root"));
installStaticApiFallback();

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
const isGitHubPages = window.location.hostname.endsWith("github.io");
const Router = isGitHubPages ? HashRouter : BrowserRouter;
const routerProps = isGitHubPages ? {} : { basename: routerBasename };

const withPublicAssetPath = (src) => {
  if (!publicPathname || typeof src !== "string" || !src.startsWith("/brand/")) {
    return src;
  }
  return src.startsWith(`${publicPathname}/`) ? src : `${publicPathname}${src}`;
};

const patchImageAssetSetters = () => {
  if (!publicPathname || window.__carebridgeImageAssetPatchInstalled) return;
  window.__carebridgeImageAssetPatchInstalled = true;

  const srcDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src");
  if (srcDescriptor?.set && srcDescriptor?.get) {
    Object.defineProperty(HTMLImageElement.prototype, "src", {
      configurable: true,
      enumerable: srcDescriptor.enumerable,
      get() {
        return srcDescriptor.get.call(this);
      },
      set(value) {
        srcDescriptor.set.call(this, withPublicAssetPath(value));
      },
    });
  }

  const originalSetAttribute = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function patchedSetAttribute(name, value) {
    if (this instanceof HTMLImageElement && String(name).toLowerCase() === "src") {
      return originalSetAttribute.call(this, name, withPublicAssetPath(String(value)));
    }
    return originalSetAttribute.call(this, name, value);
  };
};

const normalizePublicAssetImages = () => {
  if (!publicPathname) return;

  document.querySelectorAll('img[src^="/brand/"]').forEach((image) => {
    const src = image.getAttribute("src");
    if (src && !src.startsWith(publicPathname)) {
      image.setAttribute("src", `${publicPathname}${src}`);
    }
  });
};

patchImageAssetSetters();
normalizePublicAssetImages();
new MutationObserver(normalizePublicAssetImages).observe(document.documentElement, {
  childList: true,
  subtree: true,
});

root.render(
  <SnackbarProvider maxSnack={4}>
    <Router {...routerProps}>
      <App />
    </Router>
  </SnackbarProvider>
);
