import type { Dictionary } from "./dictionary";

/**
 * Bashir&Co — English dictionary (secondary locale).
 * Same register as the Russian original: calm, warm, specific.
 */
export const en: Dictionary = {
  categoryLabels: {
    watches: "Watches",
    fashion: "Clothing",
    footwear: "Footwear",
    bags: "Bags & Cases",
    jewelry: "Jewelry",
    accessories: "Accessories",
    perfume: "Perfume",
  },
  meta: {
    siteTitle: "Bashir&Co — Private Sourcing of Rare Pieces",
    siteDescription:
      "We source luxury pieces to order: watches, clothing, footwear, bags, jewelry, accessories, perfume. What the stores don't carry. Delivered to Almaty.",
  },
  nav: {
    open: "Open menu",
    close: "Close menu",
    collection: "Curated Pieces",
    privateSourcing: "Private Sourcing",
    about: "About the Project",
    contact: "Contact",
    concierge: "Concierge",
    conciergeAria: "Write to the project concierge",
    switchLocale: "RU",
    switchLocaleAria: "Переключить на русский",
  },
  common: {
    brand: "Bashir&Co",
    viewCollection: "View the Collection",
    contactUs: "Contact Us",
    learnMore: "Learn More",
    askAboutPiece: "Ask About This Piece",
    describeRequest: "Describe What You're Seeking",
    submitInquiry: "Submit an inquiry",
    viewCurated: "View curated pieces",
  },
  home: {
    hero: {
      label: "Private luxury sourcing",
      title: "We find what stores don't have.",
      subtitle:
        "Watches, clothing, footwear, bags, jewelry. Tell us what you're after — we find it, check it, and bring it to Almaty.",
    },
    lifestyle: {
      statement:
        "We check every piece ourselves: authenticity, condition, what's included, and its history.",
    },
    showcase: {
      label: "Available Now",
      cta: "View",
    },
    split: {
      label: "Sourced to Order",
      title: "Name the model — or just describe it",
      text: "A discontinued piece, a rare size, a particular colour. We find what the stores in Kazakhstan don't carry — and bring it to Almaty.",
      ctaPrimary: "How it works",
      ctaSecondary: "Message us",
    },
    stories: [
      { title: "We verify authenticity", text: "We work only with trusted sellers. For pieces with history, we request papers and expert checks." },
      { title: "We show the real condition", text: "Honest photos and video before you buy — scuffs and wear included, if there are any." },
      { title: "We don't talk about you", text: "What you bought and for how much stays between us. No stories, no publicity." },
    ],
    serviceBanner: {
      label: "Sourced on request",
      statement: "This site shows only a fraction. Tell us what you need — name the model, or just describe it.",
      cta: "Message us on WhatsApp",
    },
    categories: {
      heading: "What We Source",
      intro:
        "Seven main areas. If what you need isn't on the list, ask anyway — we can probably help.",
      items: [
        { name: "Watches", note: "Vintage references and archive examples" },
        { name: "Clothing", note: "Cashmere, rare cloths, archive collections" },
        { name: "Footwear", note: "Handwork and rare leathers" },
        { name: "Bags", note: "Classic models and commissioned examples" },
        { name: "Jewelry", note: "Stones with history, old cuts" },
        { name: "Accessories", note: "Small objects of precise work" },
        { name: "Perfume", note: "Niche and discontinued fragrances" },
      ],
    },
    howItWorks: {
      heading: "How It Works",
      steps: [
        {
          title: "You message us",
          text: "On WhatsApp or Telegram. Name the model, or just describe it: 'a watch like…', 'a bag in this colour'.",
        },
        {
          title: "We clarify the details",
          text: "Size, colour, condition (new or pre-owned), budget, and when you need it.",
        },
        {
          title: "We search and show options",
          text: "Usually 3–14 days. You get photos, video, price, and delivery time for each option.",
        },
        {
          title: "We check before buying",
          text: "Authenticity, condition, what's included, papers. If something's off, we say so immediately.",
        },
        {
          title: "We bring it to you",
          text: "Delivery to Almaty in 1–3 weeks. You pay only after you've approved the option.",
        },
      ],
    },
    selectedPieces: {
      heading: "Available Now",
      intro: "Pieces you can buy right now. Price on request.",
    },
    privateSourcing: {
      heading: "Didn't find it?",
      text: "That's normal — we show only a fraction here. Tell us what you're looking for and we'll source it for you.",
    },
    house: {
      statement: "Quiet, and straight with you.",
      text: "We don't publish names or talk about deals. And if we don't like a piece, or the seller feels off, we'll tell you — even if it kills the sale.",
      cta: "About the Project",
    },
    contact: {
      heading: "Message Us",
      text: "We reply personally on WhatsApp or Telegram. Usually within a day.",
    },
  },
  collectionPage: {
    title: "Curated Pieces",
    intro: "Pieces available now. Price and details on request via WhatsApp.",
    categoriesLine:
      "Watches · Clothing · Footwear · Bags · Jewelry · Accessories",
    inquire: "Inquire",
    closing:
      "Didn't find what you need? Message us — we'll source it.",
    closingCta: "Message Us",
    quieterWay:
      "If you already know what you're looking for, tell us directly. It's faster than searching the site.",
    quieterWayCta: "Describe What You're Seeking",
  },
  specialPieces: {
    title: "Sourced on Request",
    text: "This is how we find most pieces — for one specific person. A discontinued model, a rare size, a particular colour, something from an old collection. Tell us what you need, and we'll say whether it's findable, how long it'll take, and what it'll cost.",
    cta: "Message Us",
  },
  about: {
    title: "About the Project",
    principles: {
      heading: "How We Work",
      items: [
        {
          title: "Honest about condition",
          text: "Real photos and video before you buy. If there's wear or scuffs, we show them and say so.",
        },
        {
          title: "We verify authenticity",
          text: "Trusted sellers only. For vintage and rare pieces we request papers and expert checks.",
        },
        {
          title: "A person answers",
          text: "No bots, no script-reading managers. The person who replies is the one who'll find your piece.",
        },
      ],
    },
    cta: "Message Us",
    paragraphs: [
      "Bashir&Co sources luxury pieces to order — watches, clothing, footwear, bags, jewelry, accessories. We find what the stores in Kazakhstan don't carry: discontinued models, rare sizes, pieces from past collections.",
      "We are not a shop and not a marketplace. There is no storefront of stock and no buy button. There is a conversation: you describe what you're seeking, we search, verify, and deliver.",
      "Every piece is verified for authenticity and condition before we offer it. If a piece doesn't match what was claimed of it — we don't offer it, regardless of how long the search took.",
      "We work without noise: no client names, no deal stories, no pressure to hurry. And if a piece isn't worth it, we'll say so.",
    ],
  },
  privateSourcingPage: {
    title: "Sourced to Order",
    process: {
      title: "How It Works",
      steps: [
        "Tell us what you're looking for",
        "We clarify details and budget",
        "We show options with photos and price",
        "We check the piece before buying",
        "We bring it to you",
      ],
    },
    requests: {
      heading: "What People Ask For",
      items: [
        "A model that's been discontinued",
        "The size that's never in stock",
        "A piece from an older collection",
        "A specific colour or configuration",
        "\"Saw it on someone — want the same\"",
      ],
    },
    trust: {
      heading: "Worth Knowing",
      text: "You pay after you've approved an option. No deposits before that. And if you change your mind along the way, that's fine — just tell us.",
    },
    paragraphs: [
      "This is the main thing we do. You describe the piece — an exact model, a photo, or just words. We tell you straight away whether it's findable, how long it'll take, and roughly what it'll cost.",
      "We work with private collections, archives, and trusted dealers across Europe, Asia, and the United States. We report on the search exactly as much as you care to know — without noise.",
      "The search is confidential in both directions: the seller doesn't know who we're searching for, unless you want them to.",
    ],
    cta: "Start a Conversation",
  },
  contactPage: {
    title: "Contact",
    intro: "Write to us whichever way is convenient. We reply personally, usually within a day.",
    selectedPieceLabel: "Selected piece",
    channelsHeading: "Direct Channels",
    email: "WhatsApp",
    telegram: "Telegram",
    phone: "WhatsApp",
    form: {
      heading: "Or Leave a Message",
      required: "This field is required",
      name: "Your name",
      contact: "How to reach you",
      message: "What you're seeking",
      messagePlaceholderNote:
        "A reference, a description, a photo link — any starting point is enough.",
      submit: "Send",
      mailtoNote:
        "The button opens WhatsApp with the message prepared — nothing is sent without your confirmation.",
    },
  },
  notFound: {
    statement: "This page doesn't exist.",
    home: "Return home",
  },
  announcement: "Personal concierge — Monday to Saturday, 10:00 to 20:00",
  search: "Search",
  breadcrumbHome: "Home",
  searchOverlay: {
    placeholder: "What are you looking for?",
    categoriesHeading: "Categories",
    featuredHeading: "Selected pieces",
    resultsHeading: "Results",
    noResults: "Nothing found. Describe what you're seeking — we'll source it.",
    close: "Close search",
  },
  footer: {
    tagline: "Private sourcing of rare pieces",
    rights: "All rights reserved",
    navHeading: "Navigation",
    contactsHeading: "Contact",
    getInTouch: "Get in touch",
    getInTouchText: "Write to us directly — on WhatsApp or Telegram. We reply personally, no mailing lists, no intermediaries.",
    serviceHeading: "Service",
    languageRegion: "International (English)",
  },
};
