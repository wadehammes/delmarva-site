import { RichText } from "src/components/RichText/RichText.component";
import type { FooterType } from "src/contentful/getFooter";
import { Link } from "src/i18n/routing";
import DelmarvaLogo from "src/icons/delmarva-white.svg";
import LinkedInIcon from "src/icons/linkedin.svg";
import { parseCtaUrl } from "src/utils/urlHelpers";
import styles from "./Footer.module.css";

interface FooterProps {
  footer: FooterType | null;
}

export const Footer = (props: FooterProps) => {
  const { footer } = props;

  if (!footer) return null;

  const { addresscompanyInfo, links, copyright, linkedInUrl, linksTitle } =
    footer;

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <DelmarvaLogo className={styles.footerLogo} />
        </div>
        <div className={styles.footerSection}>
          {linksTitle && <h3>{linksTitle}</h3>}
          {links && links.length > 0 && (
            <ul className={styles.footerLinks}>
              {links.map((link) => {
                if (!link) {
                  return null;
                }

                const url = parseCtaUrl(link);

                if (!url) {
                  return null;
                }

                return (
                  <li key={link.id}>
                    <Link className={styles.footerLink} href={url}>
                      {link.text}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className={styles.footerSection}>
          <RichText document={addresscompanyInfo} />
        </div>
      </div>
      <div className={styles.footerCopyright}>
        <span>
          &copy; {new Date().getFullYear()} {copyright}
        </span>
        {linkedInUrl && (
          <p>
            <Link href={linkedInUrl}>
              <LinkedInIcon />
            </Link>
          </p>
        )}
      </div>
    </footer>
  );
};
