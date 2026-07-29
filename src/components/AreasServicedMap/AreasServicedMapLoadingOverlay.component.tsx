import { Skeleton } from "src/components/Skeleton/Skeleton.component";
import styles from "./AreasServicedMap.module.css";

interface AreasServicedMapLoadingOverlayProps {
  message?: string;
}

export const AreasServicedMapLoadingOverlay = ({
  message = "Loading service areas…",
}: AreasServicedMapLoadingOverlayProps) => (
  <div
    aria-busy="true"
    aria-live="polite"
    className={styles.loadingOverlay}
    role="status"
  >
    <Skeleton aria-hidden className={styles.loadingSkeleton} variant="media" />
    <div className={styles.loadingPanel}>
      <span aria-hidden className={styles.loadingSpinner} />
      <p className={styles.loadingMessage}>{message}</p>
    </div>
  </div>
);
