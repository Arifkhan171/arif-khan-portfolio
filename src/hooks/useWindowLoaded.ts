import { useEffect, useState } from "react";

/** True once the window `load` event has fired (already true on client-side navigation). */
export function useWindowLoaded(): boolean {
  const [loaded, setLoaded] = useState(() => document.readyState === "complete");
  useEffect(() => {
    if (loaded) return;
    const onLoad = () => setLoaded(true);
    window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, [loaded]);
  return loaded;
}
