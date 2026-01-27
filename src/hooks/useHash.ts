import { useEffect, useState } from "react";
import { isBrowser } from "src/utils/helpers";

export const useHash = () => {
  const [hash, setHash] = useState<string>(() => {
    if (!isBrowser()) {
      return "";
    }
    return window.location.hash;
  });

  useEffect(() => {
    if (!isBrowser()) {
      return;
    }

    const onHashChange = () => {
      setHash(window.location.hash);
    };

    window.addEventListener("hashchange", onHashChange, true);

    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return hash;
};
