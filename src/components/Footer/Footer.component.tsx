"use client";

import LocaleSwitcherSelect from "src/components/LocaleSwitcherSelect/LocaleSwitcherSelect.component";
import { RichText } from "src/components/RichText/RichText.component";
import type { FooterType } from "src/contentful/getFooter";
import { Link } from "src/i18n/routing";
import LinkedInIcon from "src/icons/linkedin.svg";
import DelmarvaBadge from "src/logos/delmarva-white-outlined-badge-full-color-rgb.svg";
import { parseCtaUrl } from "src/utils/urlHelpers";
import styles from "./Footer.module.css";

interface FooterProps {
  footer: FooterType | null;
}

export const Footer = (props: FooterProps) => {
  const { footer } = props;

  if (!footer) return null;

  const {
    addresscompanyInfo,
    links,
    copyright,
    linkedInUrl,
    linksTitle,
    otherLinks,
    otherLinksTitle,
  } = footer;

  return (
    <footer className={styles.footer}>
      <div className="page-scroll">
        <button
          onClick={() => {
            window.scrollTo({ behavior: "smooth", top: 0 });
          }}
          type="button"
        >
          <span>Scroll</span>
        </button>
      </div>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <DelmarvaBadge className={styles.footerLogo} />
        </div>
        {links && links.length > 0 ? (
          <div className={styles.footerSection}>
            {linksTitle && (
              <span className={styles.footerLinksTitle}>{linksTitle}</span>
            )}
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
          </div>
        ) : null}
        {otherLinks && otherLinks.length > 0 ? (
          <div className={styles.footerSection}>
            {otherLinksTitle && (
              <span className={styles.footerLinksTitle}>{otherLinksTitle}</span>
            )}
            <ul className={styles.footerLinks}>
              {otherLinks.map((link) => {
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
          </div>
        ) : null}
        <div className={styles.footerSection}>
          <RichText document={addresscompanyInfo} />
          <div className={styles.footerSocials}>
            {linkedInUrl && (
              <Link href={linkedInUrl}>
                <LinkedInIcon />
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className={styles.footerCopyright}>
        <span className={styles.footerCopyrightText}>
          &copy; {new Date().getFullYear()} {copyright}
        </span>
        <div className={styles.footerActions}>
          <LocaleSwitcherSelect />
        </div>
      </div>
    </footer>
  );
};
