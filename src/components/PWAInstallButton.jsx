"use client";
import { useState, useEffect } from "react";
import { Download } from "lucide-react";

// variant="icon"   → small circular button for header
// variant="banner" → full-width button for register page
export default function PWAInstallButton({ variant = "icon" }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstallable(false);
    setDeferredPrompt(null);
  };

  if (!isInstallable) return null;

  if (variant === "banner") {
    return (
      <button
        onClick={handleInstall}
        className="flex items-center justify-center gap-2 w-full h-12 rounded-xl border border-[#228B22] bg-[#f0faf0] text-[#228B22] font-semibold text-sm hover:bg-[#228B22] hover:text-white active:scale-[0.98] transition-all duration-150"
      >
        <Download size={17} strokeWidth={2.5} />
        Install TG Level App
      </button>
    );
  }

  return (
    <button
      onClick={handleInstall}
      title="Install App"
      className="w-8 h-8 bg-[#228B22] rounded-full flex items-center justify-center shrink-0 hover:bg-[#1a6b1a] active:scale-95 transition-all duration-150"
    >
      <Download size={15} color="#ffffff" strokeWidth={2.5} />
    </button>
  );
}
