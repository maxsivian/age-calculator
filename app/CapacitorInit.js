"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { Keyboard, KeyboardResize } from "@capacitor/keyboard";

/**
 * Initializes Capacitor native plugins when running inside Android/iOS.
 * Does nothing in the browser (web / Next.js `npm run dev`).
 */
export default function CapacitorInit() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    async function setup() {
      try {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: "#000000" });
      } catch {
        // StatusBar may not be available on every platform/version
      }

      try {
        await Keyboard.setResizeMode({ mode: KeyboardResize.Body });
      } catch {
        // Keyboard plugin optional
      }

      try {
        await SplashScreen.hide();
      } catch {
        // Splash already auto-hidden via config
      }
    }

    setup();
  }, []);

  return null;
}
