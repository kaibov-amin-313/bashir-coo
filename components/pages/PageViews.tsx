"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TypeBase } from "@/components/type";
import { SkipLink } from "@/components/a11y";
import { MediaSlot } from "@/components/media";
import { NavConciergeThread } from "@/components/nav";
import { SiteHeader } from "@/components/header";
import { FooterRoot } from "@/components/footer";
import { CollectionOpeningFrame } from "@/components/collection";
import { FormField } from "@/components/form";
import { routes, PIECE_QUERY_PARAM } from "@/config/routes";
import { getCuratedPieceBySlug } from "@/data/curatedPieces";
import { pieceText } from "@/lib/i18n";
import { localePath, type Dictionary, type Locale } from "@/lib/i18n";
import styles from "./Pages.module.css";

/**
 * Bashir&Co — About, Private Sourcing, and Contact views.
 *
 * Client components (Contact needs form state; the others share the
 * chrome), composed by thin RU/EN route files. All copy from the
 * dictionary. The Contact form composes a WhatsApp message — honest for
 * an MVP with no backend: nothing sends without the visitor's own email
 * client confirming it, and the note under the button says exactly that.
 *
 * Contact details are deliberate placeholders marked for the client to
 * replace before launch — inventing a real-looking phone number would
 * be worse than an obvious placeholder.
 */

import {
  CONTACT_TELEGRAM,
  CONTACT_TELEGRAM_URL,
  CONTACT_WHATSAPP_DISPLAY,
  CONTACT_WHATSAPP_URL,
  whatsappLink,
} from "@/lib/contacts";

interface ViewProps {
  locale: Locale;
  dictionary: Dictionary;
}

function PageChrome({
  locale,
  dictionary,
  children,
}: ViewProps & { children: React.ReactNode }) {
  return (
    <>
      <SkipLink locale={locale} />
      <SiteHeader locale={locale} dictionary={dictionary} />
      <NavConciergeThread locale={locale} dictionary={dictionary} />
      <main id="content" lang={locale === "en" ? "en" : undefined}>{children}</main>
      <FooterRoot locale={locale} dictionary={dictionary} />
    </>
  );
}

export function AboutView({ locale, dictionary }: ViewProps) {
  const a = dictionary.about;
  return (
    <PageChrome locale={locale} dictionary={dictionary}>
      <CollectionOpeningFrame
        title={a.title}
        atmosphere={a.paragraphs[0]}
        heroImage="/images/editorial/about-hero.jpg"
        heroFallback="interiorWarm"
      />

      <section className={styles.storySplit}>
        <div className={styles.storyVisual}>
          <MediaSlot
            src="/images/editorial/about-story.jpg"
            fallbackKind="interiorWarm"
            className={styles.fillSlot}
          />
        </div>
        <div className={styles.storyText}>
          {a.paragraphs.slice(1).map((paragraph) => (
            <TypeBase key={paragraph.slice(0, 24)} variant="body" as="p">
              {paragraph}
            </TypeBase>
          ))}
        </div>
      </section>

      <section className={styles.principles} aria-label={a.principles.heading}>
        <TypeBase variant="actTitle" as="h2">
          {a.principles.heading}
        </TypeBase>
        <div className={styles.principlesGrid}>
          {a.principles.items.map((item) => (
            <div key={item.title} className={styles.principle}>
              <TypeBase variant="objectTitle" as="h3">
                {item.title}
              </TypeBase>
              <TypeBase variant="body" as="p">
                {item.text}
              </TypeBase>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.ctaBand}>
        <Link
          href={localePath(locale, routes.contact)}
          className={styles.ctaButton}
        >
          <TypeBase variant="ctaText" as="span">
            {a.cta}
          </TypeBase>
        </Link>
      </section>
    </PageChrome>
  );
}

export function PrivateSourcingView({ locale, dictionary }: ViewProps) {
  const p = dictionary.privateSourcingPage;
  return (
    <PageChrome locale={locale} dictionary={dictionary}>
      <CollectionOpeningFrame
        title={p.title}
        atmosphere={p.paragraphs[0]}
        heroImage="/images/editorial/sourcing-hero.jpg"
        heroFallback="interiorWarm"
      />

      <section className={styles.timeline} aria-label={p.process.title}>
        <TypeBase variant="actTitle" as="h2">
          {p.process.title}
        </TypeBase>
        <ol className={styles.timelineSteps}>
          {p.process.steps.map((step, index) => (
            <li key={step} className={styles.timelineStep}>
              <span className={styles.timelineNumber} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <TypeBase variant="body" as="p">
                {step}
              </TypeBase>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.requestsSplit} aria-label={p.requests.heading}>
        <div className={styles.requestsText}>
          <TypeBase variant="actTitle" as="h2">
            {p.requests.heading}
          </TypeBase>
          <ul className={styles.requestsList}>
            {p.requests.items.map((item) => (
              <li key={item.slice(0, 24)} className={styles.requestsItem}>
                <TypeBase variant="body" as="p">
                  {item}
                </TypeBase>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.requestsVisual}>
          <MediaSlot
            src="/images/editorial/sourcing-detail.jpg"
            fallbackKind="productStill"
            className={styles.fillSlot}
          />
        </div>
      </section>

      <section className={styles.trustPanel} aria-label={p.trust.heading}>
        <TypeBase variant="collectionTitle" as="h2">
          {p.trust.heading}
        </TypeBase>
        <div className={styles.trustText}>
          <TypeBase variant="body" as="p">
            {p.trust.text}
          </TypeBase>
          {p.paragraphs.slice(1).map((paragraph) => (
            <TypeBase key={paragraph.slice(0, 24)} variant="body" as="p">
              {paragraph}
            </TypeBase>
          ))}
        </div>
        <Link
          href={localePath(locale, routes.contact)}
          className={styles.ctaButton}
        >
          <TypeBase variant="ctaText" as="span">
            {p.cta}
          </TypeBase>
        </Link>
      </section>
    </PageChrome>
  );
}

export function ContactView({ locale, dictionary }: ViewProps) {
  const d = dictionary.contactPage;

  return (
    <PageChrome locale={locale} dictionary={dictionary}>
      <CollectionOpeningFrame title={d.title} atmosphere={d.intro} />
      <ContactBody locale={locale} dictionary={dictionary} />
    </PageChrome>
  );
}

function ContactBody({ locale, dictionary }: ViewProps) {
  const d = dictionary.contactPage;
  // Query read via window.location in an effect, NOT useSearchParams:
  // useSearchParams forces a Suspense boundary on static routes, which
  // was deferring the ENTIRE form out of the prerendered HTML. This way
  // the form is fully static (works before hydration, visible to
  // crawlers) and only the selected-piece line hydrates in.
  const [pieceSlug, setPieceSlug] = useState<string | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const params = new URLSearchParams(window.location.search);
      setPieceSlug(params.get(PIECE_QUERY_PARAM));
    });
    return () => cancelAnimationFrame(raf);
  }, []);
  // Curated pieces first; the legacy passage pieces (collection rooms)
  // resolve through the localized pieceText table as a fallback, so
  // every "Ask about this piece" link on the site preselects correctly.
  const curated = pieceSlug ? getCuratedPieceBySlug(pieceSlug, locale) : null;
  const legacy =
    !curated && pieceSlug ? pieceText[pieceSlug]?.[locale] ?? null : null;
  const selectedPiece = curated
    ? { title: curated.title, inquirySubject: curated.inquirySubject }
    : legacy
      ? {
          title: legacy.title,
          inquirySubject: `Bashir&Co — ${legacy.title}`,
        }
      : null;

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    contact?: string;
    message?: string;
  }>({});

  const subject = selectedPiece
    ? selectedPiece.inquirySubject
    : `Bashir&Co — ${name || "—"}`;

  const selectedLine = selectedPiece
    ? `${d.selectedPieceLabel}: ${selectedPiece.title}\n\n`
    : "";

  // Inquiries go to WhatsApp (the house has no email). The message is
  // pre-filled with the selected piece and the form's fields.
  const whatsappHref = whatsappLink(
    `${selectedLine}${d.form.name}: ${name}\n${d.form.contact}: ${contact}\n\n${d.form.message}:\n${message}`
  );

  function handleSubmit() {
    const nextErrors: typeof errors = {};
    if (!name.trim()) nextErrors.name = d.form.required;
    if (!contact.trim()) nextErrors.contact = d.form.required;
    if (!message.trim()) nextErrors.message = d.form.required;
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      window.open(whatsappHref, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <section className={styles.contactColumns}>
      <div className={styles.channels}>
        <TypeBase variant="objectTitle" as="h2">
          {d.channelsHeading}
        </TypeBase>
        <dl className={styles.channelList}>
          <div className={styles.channelRow}>
            <dt>
              <TypeBase variant="metadata" as="span">
                {d.email}
              </TypeBase>
            </dt>
            <dd>
              <a
                href={CONTACT_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.channelLink}
              >
                <TypeBase variant="body" as="span">
                  {CONTACT_WHATSAPP_DISPLAY}
                </TypeBase>
              </a>
            </dd>
          </div>
          <div className={styles.channelRow}>
            <dt>
              <TypeBase variant="metadata" as="span">
                {d.telegram}
              </TypeBase>
            </dt>
            <dd>
              <a
                href={CONTACT_TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.channelLink}
              >
                <TypeBase variant="body" as="span">
                  {CONTACT_TELEGRAM}
                </TypeBase>
              </a>
            </dd>
          </div>
          <div className={styles.channelRow}>
            <dt>
              <TypeBase variant="metadata" as="span">
                {d.phone}
              </TypeBase>
            </dt>
            <dd>
              <TypeBase variant="body" as="span">
                {CONTACT_WHATSAPP_DISPLAY}
              </TypeBase>
            </dd>
          </div>
        </dl>
      </div>

      <div className={styles.inquiry}>
        <TypeBase variant="objectTitle" as="h2">
          {d.form.heading}
        </TypeBase>

        {selectedPiece ? (
          <p className={styles.selectedPiece}>
            <TypeBase variant="formLabel" as="span">
              {d.selectedPieceLabel}:
            </TypeBase>{" "}
            <TypeBase variant="body" as="span">
              {selectedPiece.title}
            </TypeBase>
          </p>
        ) : null}

        <div className={styles.formFields}>
          <FormField
            id="inquiry-name"
            label={d.form.name}
            value={name}
            onChange={setName}
            error={errors.name}
          />
          <FormField
            id="inquiry-contact"
            label={d.form.contact}
            value={contact}
            onChange={setContact}
            error={errors.contact}
          />
          <FormField
            id="inquiry-message"
            label={d.form.message}
            mode="textarea"
            value={message}
            onChange={setMessage}
            note={d.form.messagePlaceholderNote}
            error={errors.message}
          />
        </div>
        <button type="button" onClick={handleSubmit} className={styles.submit}>
          <TypeBase variant="ctaText" as="span">
            {d.form.submit}
          </TypeBase>
        </button>
        <TypeBase variant="caption" as="p">
          {d.form.mailtoNote}
        </TypeBase>
      </div>
    </section>
  );
}
