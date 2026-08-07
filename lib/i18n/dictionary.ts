/**
 * Bashir&Co — Dictionary contract.
 *
 * The single typed shape both locales must satisfy — TypeScript enforces
 * that RU and EN never drift apart structurally. No i18n library: for an
 * MVP with two locales and a handful of pages, a typed object is
 * simpler, faster, and fully static-render-friendly.
 *
 * Rule: no large copy block lives inside a component. Components receive
 * a dictionary (or a slice of one) and render it.
 */

export type Locale = "ru" | "en";

import type { Category } from "@/types";

export interface Dictionary {
  categoryLabels: Record<Category, string>;
  meta: {
    siteTitle: string;
    siteDescription: string;
  };
  nav: {
    open: string;
    close: string;
    collection: string;
    privateSourcing: string;
    about: string;
    contact: string;
    concierge: string;
    conciergeAria: string;
    switchLocale: string; // label of the OTHER locale, e.g. "EN" on RU pages
    switchLocaleAria: string;
  };
  common: {
    brand: string;
    viewCollection: string;
    contactUs: string;
    learnMore: string;
    askAboutPiece: string;
    describeRequest: string;
    submitInquiry: string;
    viewCurated: string;
  };
  home: {
    hero: {
      label: string;
      title: string;
      subtitle: string;
    };
    lifestyle: {
      statement: string;
    };
    stories: { title: string; text: string }[];
    showcase: {
      label: string;
      cta: string;
    };
    split: {
      label: string;
      title: string;
      text: string;
      ctaPrimary: string;
      ctaSecondary: string;
    };
    serviceBanner: {
      label: string;
      statement: string;
      cta: string;
    };
    categories: {
      heading: string;
      intro: string;
      items: { name: string; note: string }[];
    };
    howItWorks: {
      heading: string;
      steps: { title: string; text: string }[];
    };
    selectedPieces: {
      heading: string;
      intro: string;
    };
    privateSourcing: {
      heading: string;
      text: string;
    };
    house: {
      statement: string;
      text: string;
      cta: string;
    };
    contact: {
      heading: string;
      text: string;
    };
  };
  collectionPage: {
    title: string;
    intro: string;
    categoriesLine: string;
    viewPiece: string;
    inquire: string;
    closing: string;
    closingCta: string;
    quieterWay: string;
    quieterWayCta: string;
  };
  specialPieces: {
    title: string;
    text: string;
    cta: string;
  };
  about: {
    title: string;
    paragraphs: string[];
    principles: { heading: string; items: { title: string; text: string }[] };
    cta: string;
  };
  privateSourcingPage: {
    title: string;
    paragraphs: string[];
    process: { title: string; steps: string[] };
    requests: { heading: string; items: string[] };
    trust: { heading: string; text: string };
    cta: string;
  };
  contactPage: {
    title: string;
    intro: string;
    channelsHeading: string;
    email: string;
    telegram: string;
    phone: string;
    selectedPieceLabel: string;
    form: {
      heading: string;
      required: string;
      name: string;
      contact: string;
      message: string;
      messagePlaceholderNote: string;
      submit: string;
      mailtoNote: string;
    };
  };
  notFound: {
    statement: string;
    home: string;
  };
  announcement: string;
  search: string;
  breadcrumbHome: string;
  searchOverlay: {
    placeholder: string;
    categoriesHeading: string;
    featuredHeading: string;
    resultsHeading: string;
    noResults: string;
    close: string;
  };
  footer: {
    tagline: string;
    rights: string;
    navHeading: string;
    contactsHeading: string;
    getInTouch: string;
    getInTouchText: string;
    serviceHeading: string;
    languageRegion: string;
  };
}
