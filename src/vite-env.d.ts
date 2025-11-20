/// <reference types="vite/client" />

declare global {
  interface Window {
    __KIOECS_DEBUG__?: boolean;
  }
}
