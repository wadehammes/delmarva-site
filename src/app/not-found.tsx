import Link from "next/link";
import styles from "src/components/NotFoundPage/NotFoundPage.module.css";

export default function NotFound() {
  return (
    <div className={styles.notFoundPage}>
      <h1>Page not found.</h1>
      <Link href="/">Go to home</Link>
    </div>
  );
}
