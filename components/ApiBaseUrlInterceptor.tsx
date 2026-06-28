"use client";

import { useEffect } from "react";

export function ApiBaseUrlInterceptor() {
  useEffect(() => {
    if (typeof window !== "undefined" && !(window as any).__gff_fetch_intercepted__) {
      (window as any).__gff_fetch_intercepted__ = true;
      const originalFetch = window.fetch;

      window.fetch = function (input, init) {
        const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
        const pathname = window.location.pathname;
        const isPortalOrAdmin = pathname.startsWith("/portal") || pathname.startsWith("/admin");

        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

        if (isPortalOrAdmin && apiBase) {
          let isLocalApiCall = false;
          let apiPath = "";

          if (url.startsWith("/api/v1")) {
            isLocalApiCall = true;
            apiPath = url.slice(7);
          } else if (url.startsWith("api/v1")) {
            isLocalApiCall = true;
            apiPath = url.slice(6);
          } else if (url.startsWith(window.location.origin + "/api/v1")) {
            isLocalApiCall = true;
            apiPath = url.slice((window.location.origin + "/api/v1").length);
          }

          if (isLocalApiCall) {
            const cleanBase = apiBase.replace(/\/$/, "");
            const cleanPath = apiPath.replace(/^\//, "");
            const newUrl = cleanPath ? `${cleanBase}/${cleanPath}` : cleanBase;

            if (typeof input === "string") {
              input = newUrl;
            } else if (input instanceof URL) {
              input = new URL(newUrl);
            } else {
              // Reconstruct the Request object with the updated URL
              input = new Request(newUrl, input);
            }
          }
        }

        return originalFetch.call(this, input, init);
      };
    }
  }, []);

  return null;
}
