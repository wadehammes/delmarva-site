import { useEffect, useState } from "react";
import { isBrowser } from "src/utils/helpers";

export const useHash = () => {
  const [hash, setHash] = useState(isBrowser() ? window.location.hash : "");

  useEffect(() => {
    const onHashChange = () => {
      setHash(window.location.hash);
    };

    window.addEventListener("hashchange", onHashChange, true);

    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return hash;
};
