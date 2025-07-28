import { useEffect, useState } from "react";
import { isBrowser } from "src/utils/helpers";

export const useHash = () => {
  const [hash, setHash] = useState<string>("");

  useEffect(() => {
    // Only run on client side
    if (!isBrowser()) {
      return;
    }

    // Set initial hash
    setHash(window.location.hash);

    const onHashChange = () => {
      setHash(window.location.hash);
    };

    window.addEventListener("hashchange", onHashChange, true);

    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return hash;
};
