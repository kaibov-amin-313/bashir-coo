import Link from "next/link";
import { TypeBase } from "@/components/type";
import { Wordmark } from "@/components/brand";
import { getNavMenuItems } from "@/components/nav";
import { localePath, type Dictionary, type Locale } from "@/lib/i18n";
import { routes } from "@/config/routes";
import {
  CONTACT_TELEGRAM,
  CONTACT_TELEGRAM_URL,
  CONTACT_WHATSAPP_DISPLAY,
  CONTACT_WHATSAPP_URL,
} from "@/lib/contacts";
import styles from "./Footer.module.css";

/**
 * Bashir&Co — footer (Loro Piana structure, Bashir Rosewood panel).
 *
 * A large rosewood panel: "Get in touch" block left (email/telegram —
 * our newsletter replacement, since we don't run a mailing list) + three
 * link columns (Navigation / Service / Contact). Below, on the light
 * ground: language-region left, wordmark centre, socials right, then a
 * quiet legal line. Rosewood hairline tops the whole thing.
 */

interface FooterRootProps {
  locale: Locale;
  dictionary: Dictionary;
}

const SOCIALS = ["Instagram", "Telegram", "WhatsApp"];

export function FooterRoot({ locale, dictionary }: FooterRootProps) {
  const items = getNavMenuItems(locale, dictionary);
  const year = new Date().getFullYear();
  const f = dictionary.footer;

  return (
    <footer className={styles.root}>
      {/* Rosewood panel */}
      <div className={styles.panel}>
        <div className={styles.panelInner}>
          {/* Get in touch — left */}
          <div className={styles.getInTouch}>
            <TypeBase variant="actTitle" as="h2">{f.getInTouch}</TypeBase>
            <div className={styles.getInTouchText}>
              <TypeBase variant="body" as="p">{f.getInTouchText}</TypeBase>
            </div>
            <div className={styles.channels}>
              <a href={CONTACT_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={styles.channel}>
                <TypeBase variant="navItem" as="span">WhatsApp — {CONTACT_WHATSAPP_DISPLAY}</TypeBase>
              </a>
              <a href={CONTACT_TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className={styles.channel}>
                <TypeBase variant="navItem" as="span">Telegram — {CONTACT_TELEGRAM}</TypeBase>
              </a>
            </div>
          </div>

          {/* Link columns — right */}
          <nav className={styles.col} aria-label={f.navHeading}>
            <span className={styles.colHeading}>
              <TypeBase variant="metadata" as="span">{f.navHeading}</TypeBase>
            </span>
            {items.map((item) => (
              <Link key={item.href} href={item.href} className={styles.link}>
                <TypeBase variant="navItem" as="span">{item.label}</TypeBase>
              </Link>
            ))}
          </nav>

          <div className={styles.col}>
            <span className={styles.colHeading}>
              <TypeBase variant="metadata" as="span">{f.serviceHeading}</TypeBase>
            </span>
            <Link href={localePath(locale, routes.privateSourcing)} className={styles.link}>
              <TypeBase variant="navItem" as="span">{dictionary.privateSourcingPage.title}</TypeBase>
            </Link>
            <Link href={localePath(locale, routes.specialPiecesByRequest)} className={styles.link}>
              <TypeBase variant="navItem" as="span">{dictionary.specialPieces.title}</TypeBase>
            </Link>
            <Link href={localePath(locale, routes.about)} className={styles.link}>
              <TypeBase variant="navItem" as="span">{dictionary.about.title}</TypeBase>
            </Link>
          </div>

          <div className={styles.col}>
            <span className={styles.colHeading}>
              <TypeBase variant="metadata" as="span">{f.contactsHeading}</TypeBase>
            </span>
            <Link href={localePath(locale, routes.contact)} className={styles.link}>
              <TypeBase variant="navItem" as="span">{dictionary.contactPage.title}</TypeBase>
            </Link>
            <a href={CONTACT_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={styles.link}>
              <TypeBase variant="navItem" as="span">WhatsApp</TypeBase>
            </a>
            <a href={CONTACT_TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className={styles.link}>
              <TypeBase variant="navItem" as="span">Telegram</TypeBase>
            </a>
          </div>
        </div>
      </div>

      {/* Light base row: language / wordmark / socials */}
      <div className={styles.baseRow}>
        <span className={styles.langRegion}>
          <span className={styles.globe} aria-hidden="true" />
          <TypeBase variant="navItem" as="span">{f.languageRegion}</TypeBase>
        </span>
        <Link href={localePath(locale, routes.home)} className={styles.baseMark}>
          <Wordmark height={26} />
        </Link>
        <span className={styles.socials}>
          {SOCIALS.map((s) => (
            <span key={s} className={styles.social}>
              <TypeBase variant="navItem" as="span">{s}</TypeBase>
            </span>
          ))}
        </span>
      </div>

      {/* Legal line */}
      <div className={styles.legal}>
        <TypeBase variant="legal" as="p">© {year} Bashir&amp;Co. {f.rights}.</TypeBase>
      </div>
    </footer>
  );
}
