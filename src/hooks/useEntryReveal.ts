import { useOnInView } from "react-intersection-observer";
import styles from "src/styles/entryReveal.module.css";
import { resolveInViewOptions } from "src/utils/inView.helpers";

export const useEntryReveal = () => {
  const revealRef = useOnInView((visible, entry) => {
    const el = entry.target;

    if (el instanceof HTMLElement) {
      el.classList.toggle(styles.visible, visible);
    }
  }, resolveInViewOptions());

  return { ref: revealRef, revealClassName: styles.entryReveal };
};
