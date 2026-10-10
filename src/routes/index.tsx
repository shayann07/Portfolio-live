import { createFileRoute } from "@tanstack/react-router";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { useEffect, useState, type FormEvent } from "react";
import { Cursor } from "@/components/Cursor";
import { Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/SectionHead";
import { ShaderBackground } from "@/components/ShaderBackground";
import { AnimatedIcon } from "@/components/AnimatedIcon";
import { SpatialStack, SpatialCluster } from "@/components/SpatialStack";
import { SpatialWork } from "@/components/SpatialWork";
import { OpenSource } from "@/components/OpenSource";
import { LabScene } from "@/components/LabScene";
import { useSpatialPointer } from "@/components/useSpatialPointer";
import { SpatialNav } from "@/components/SpatialNav";
import { useReveal } from "@/hooks/useReveal";
import { useSectionNav, scrollToHash } from "@/hooks/useSectionNav";
import { useIdleScenes } from "@/hooks/useIdleScenes";
import { getOpenSourceContributions } from "@/server/open-source";

export const Route = createFileRoute("/")({
  loader: async () => {
    const oss = await getOpenSourceContributions();
    return { oss };
  },
  head: () => ({
    meta: [
      { title: "Muhammad Shayan — Kotlin Multiplatform Developer" },
      {
        name: "description",
        content:
          "Kotlin Multiplatform developer shipping apps that share one codebase across Android, iOS, desktop and web. 8 apps on Google Play with 70K+ installs.",
      },
      { property: "og:title", content: "Muhammad Shayan — Kotlin Multiplatform Developer" },
      {
        property: "og:description",
        content:
          "Kotlin Multiplatform developer shipping apps that share one codebase across Android, iOS, desktop and web. 8 apps on Google Play with 70K+ installs, plus open-source work in the Kotlin ecosystem.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

/* ---------- Data ---------- */
/* A new file name on purpose: browsers and CDNs cache the old URL, so a fresh name guarantees
   visitors get the current CV. The old path still serves the same file for links already out there. */
const CV_URL = "/Muhammad-Shayan-Nawaz-KMP-Developer-CV.pdf";
const CV_FILENAME = "Muhammad-Shayan-Nawaz-KMP-Developer-CV.pdf";

/** Capability claims, each anchored to the project that proves it. */
const PROOF = [
  {
    claim: "Kotlin Multiplatform",
    evidence: "One codebase, 4 targets",
    href: "#w-invoiceone",
    icon: "orbit",
  },
  {
    claim: "Shipped apps",
    evidence: "8 on Google Play · 70K+ installs",
    href: "#w-urducanvas",
    icon: "layers",
  },
  {
    claim: "Open source",
    evidence: "Merged in OkHttp, Arrow, Molecule, Haze",
    href: "#open-source",
    icon: "chip",
  },
  {
    claim: "Graphics",
    evidence: "Shader-based Compose UI",
    href: "#w-liquidglass",
    icon: "wave",
  },
];

const WORK = [
  {
    id: "w-urducanvas",
    mark: "urducanvas" as const,
    title: "UrduCanvas",
    desc: "Urdu text-on-photo design editor drawn entirely on Canvas. Right-to-left typing with Kasheeda, layers, gradients and brushes, a template library, and one-tap background removal.",
    tag: "Design editor · Kotlin Multiplatform",
    year: "2025",
    badge: "10K+ installs",
    href: "https://play.google.com/store/apps/details?id=com.webscare.urducanvas&hl=en-US",
    link: "store" as const,
  },
  {
    id: "w-invoiceone",
    mark: "invoiceone" as const,
    title: "InvoiceOne",
    desc: "Local-first invoicing on a Kotlin Multiplatform base: one codebase across Android, iOS, desktop and web, 50+ Gradle modules, every feature split api/impl behind an MVI shell.",
    tag: "Multiplatform · Kotlin",
    year: "2026",
    badge: "50+ modules",
    href: "",
    link: "soon" as const,
  },
  {
    id: "w-liquidglass",
    mark: "liquidglass" as const,
    title: "liquidglass",
    desc: "Liquid Glass for Compose Multiplatform. Real refraction, dispersion and rim lighting in one shader, applied with a single modifier. Android (AGSL) and desktop (Skia), published on Maven Central with docs.",
    tag: "Open source · Compose Multiplatform",
    year: "2026",
    badge: "Maven Central",
    href: "https://github.com/shayann07/liquidglass",
    link: "source" as const,
  },
  {
    id: "w-upscaly",
    mark: "upscaly" as const,
    title: "Upscaly",
    desc: "Free, offline AI image and video upscaling on your own GPU. Real-ESRGAN, batch queues and a VRAM governor that keeps the machine alive. Nothing is uploaded; an Android port runs the same models on ncnn and Vulkan.",
    tag: "Desktop + Android · Real-ESRGAN",
    year: "2026",
    badge: "Local GPU",
    href: "https://upscaly.shayxo.dev",
    link: "site" as const,
  },
  {
    id: "w-urduspeech",
    mark: "urduspeech" as const,
    title: "Urdu Speech to Text",
    desc: "Voice transcription for Urdu, live on Google Play with 10K+ installs.",
    tag: "Voice · Android",
    year: "2025",
    badge: "10K+ installs",
    href: "https://play.google.com/store/apps/details?id=com.webscare.urduspeechtotext&hl=en-US",
    link: "store" as const,
  },
  {
    id: "w-medly",
    mark: "medly" as const,
    title: "Medly",
    desc: "Point the camera at a paper prescription. Gemini extracts the medication list, drug names are verified against RxNorm, and two-stage alarms fire a full-screen reminder at dose time. Adherence history stays local in Room.",
    tag: "HealthTech · Android",
    year: "2026",
    badge: "RxNorm",
    href: "https://play.google.com/store/apps/details?id=com.medly.reminder&hl=en-US",
    link: "store" as const,
  },
];

const STORY = [
  {
    period: "May 2026 – Now",
    role: "Kotlin Multiplatform Developer",
    org: "Webscare · Sargodha",
    note: "Cross-platform apps with Compose Multiplatform and MVI across 50+ shared modules. Shipped 4 apps on Google Play, including Urdu Speech to Text and Speedometer GO, through CI/CD releases.",
    current: true,
  },
  {
    period: "Sep 2025 – Mar 2026",
    role: "Android Developer",
    org: "TudoNum · Portugal",
    note: "Built an on-demand services marketplace with 50+ screens: booking, provider bidding, in-app chat, payments. Integrated REST APIs with secure sign-in and offline caching.",
    current: false,
  },
  {
    period: "Jun 2024 – Now",
    role: "Freelance Android Developer",
    org: "Self-employed",
    note: "Delivered 3 production apps with 10K+ installs using offline-first sync, Firebase, Room and stable release workflows. Built LUP Reader, a reading aid for low-vision users in Spain that reads text aloud in 6 languages.",
    current: true,
  },
  {
    period: "May – Aug 2025",
    role: "Android Developer Intern",
    org: "Appverse Technologies · Lahore",
    note: "Built Android modules on MVVM and improved stability through refactoring and unit testing.",
    current: false,
  },
  {
    period: "2022 – 2026",
    role: "BS Software Engineering",
    org: "University of Sargodha",
    note: "",
    current: false,
  },
];

const LAB = [
  {
    title: "Billing & sync backend (InvoiceOne)",
    scene: "rails" as const,
    note: "The Laravel service behind InvoiceOne: Google Play subscription billing that acknowledges purchases and survives renewal and refund edge cases, delta sync that pulls a device's state in a fixed number of queries, and PDF generation for invoices, receipts and statements.",
    status: "Live",
    icon: "bolt",
  },
  {
    title: "Multi-module architecture",
    scene: "graph" as const,
    note: "A Gradle convention plugin per module type, feature modules split into api and impl so no feature reaches into another's internals, and one composition root. Boring where it counts, so changes stay local.",
    status: "50+ modules",
    icon: "orbit",
  },
  {
    title: "Shaders in Compose (liquidglass)",
    scene: "settlement" as const,
    note: "One AGSL/SkSL shader doing refraction, dispersion and rim lighting, fitted to measurements from real captures rather than tuned by eye, with a graceful fallback below Android 13.",
    status: "Maven Central",
    icon: "spark",
    href: "https://shayann07.github.io/liquidglass/",
  },
];

const STACK = [
  "Kotlin Multiplatform",
  "Kotlin",
  "Compose Multiplatform",
  "Jetpack Compose",
  "Coroutines",
  "Flow",
  "Ktor",
  "SQLDelight",
  "Koin",
  "Clean Architecture",
  "MVI",
  "Firebase",
  "Gradle",
  "Git",
  "CI/CD",
];

/* ---------- Utilities ---------- */
function SplitReveal({
  text,
  delay = 0,
  className = "",
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <span className={className}>
      {/* No sr-only twin: it duplicated the name in the h1's text content
          ("MuhammadMuhammad"). The h1 carries an aria-label instead. */}
      <span>
        {text.split(" ").map((word, wi) => (
          <span key={`${word}-${wi}`} className="inline-block whitespace-nowrap">
            {Array.from(word).map((ch, ci) => (
              <span key={`${ch}-${ci}`} className="char-mask">
                <motion.span
                  initial={shouldReduceMotion ? { y: "0%" } : { y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : {
                          duration: 0.9,
                          ease: [0.22, 1, 0.36, 1],
                          delay: delay + wi * 0.04 + ci * 0.015,
                        }
                  }
                >
                  {ch}
                </motion.span>
              </span>
            ))}
            {wi < text.split(" ").length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        ))}
      </span>
    </span>
  );
}

/* ---------- Header + Nav ---------- */
function Header({ active, hasOSS = true }: { active: string; hasOSS?: boolean }) {
  const navItems = [
    ["About", "#about"],
    ["Path", "#story"],
    ["Work", "#work"],
    ...(hasOSS ? [["Open Source", "#open-source"]] : []),
    ["Lab", "#lab"],
    ["Contact", "#contact"],
  ];
  return (
    <header className="fixed inset-x-0 top-0 z-40 hidden px-[var(--space-gutter)] py-4 md:block">
      <div className="mx-auto flex max-w-[1280px] items-center justify-center">
        <nav aria-label="Primary" className="pill">
          {navItems.map(([label, href]) => (
            <a
              key={label}
              href={href}
              data-cursor="Jump"
              className="nav-link"
              data-active={active === href.slice(1)}
              aria-current={active === href.slice(1) ? "true" : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

/* ---------- Hero ---------- */
function Hero({ scrollY }: { scrollY: MotionValue<number> }) {
  const y1 = useTransform(scrollY, [0, 500], [0, 120]);
  const y2 = useTransform(scrollY, [0, 500], [0, -60]);
  const sy1 = useSpring(y1, { stiffness: 60, damping: 22 });
  const sy2 = useSpring(y2, { stiffness: 60, damping: 22 });

  return (
    <section id="top" aria-labelledby="hero-title" className="section pt-[max(5.5rem,9vh)]">
      <div className="container-x">
        <Reveal>
          <div className="eyebrow status-live">Open to new projects</div>
        </Reveal>
        <div className="relative mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-12 items-end gap-8">
          <div className="md:col-span-8 relative z-10">
            <h1 id="hero-title" className="hd-hero" aria-label="Muhammad Shayan">
              <span className="block">
                <SplitReveal text="Muhammad" />
                {/* Keeps the two blocks from concatenating to "MuhammadShayan." in text content. */}{" "}
              </span>
              <span className="block text-[color:var(--mid)]">
                <SplitReveal text="Shayan." delay={0.15} />
              </span>
            </h1>
            <Reveal delay={0.6}>
              <p className="body-md mt-6 md:mt-8 max-w-xl">
                Kotlin Multiplatform developer shipping apps that share one codebase across Android,
                iOS, desktop and web. 8 apps on Google Play with 70K+ installs, plus open-source
                work in the Kotlin ecosystem. Based in Islamabad, working with clients worldwide.
              </p>
            </Reveal>
            <Reveal delay={0.75}>
              <div className="mt-7 md:mt-10 flex flex-wrap items-center gap-3">
                <a href="#contact" className="btn btn-primary" data-cursor="Write">
                  <AnimatedIcon name="mail" size={16} /> Start a Project
                </a>
                <a href="#work" className="btn btn-ghost" data-cursor="Scroll">
                  See Work <AnimatedIcon name="arrow" size={16} />
                </a>
                <a
                  href={CV_URL}
                  download={CV_FILENAME}
                  className="btn btn-ghost"
                  data-cursor="Save"
                  aria-label="Download CV (PDF)"
                >
                  <AnimatedIcon name="download" size={16} /> CV
                </a>
              </div>
            </Reveal>
          </div>
          <motion.div
            style={{ y: sy1 }}
            className="md:col-span-4 flex justify-center md:justify-end"
            aria-hidden
          >
            <SpatialStack />
          </motion.div>
        </div>

        {/* Proof strip — every claim links to the project that backs it. */}
        <motion.div style={{ y: sy2 }} className="mt-12 md:mt-24">
          <h2 className="sr-only">What I build, and what proves it</h2>
          <ul className="proof-strip glass rounded-[var(--radius-lg)] md:rounded-[var(--radius-xl)]">
            {PROOF.map((p, i) => (
              <li key={p.claim}>
                <Reveal delay={i * 0.08}>
                  <a
                    href={p.href}
                    data-cursor="Proof"
                    className="proof-chip"
                    aria-label={`${p.claim}: ${p.evidence}. Jump to the project that demonstrates it.`}
                  >
                    <span className="icon-box text-[color:var(--platinum)]/70 shrink-0">
                      <AnimatedIcon name={p.icon} size={20} />
                    </span>
                    <span className="min-w-0">
                      <span className="proof-chip__claim">{p.claim}</span>
                      <span className="proof-chip__evidence">{p.evidence}</span>
                    </span>
                    <span className="proof-chip__arrow" aria-hidden>
                      <AnimatedIcon name="arrow" size={14} />
                    </span>
                  </a>
                </Reveal>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- About ---------- */
function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="section">
      <SectionHead id="about-title" eyebrow="01 / About" title="What I do." kicker="Craft" />
      <div className="container-x grid gap-6 md:grid-cols-12 md:gap-10 items-start">
        <div className="md:col-span-5 md:sticky md:top-28 flex justify-center md:justify-start">
          <SpatialCluster />
        </div>
        <div className="md:col-span-7 grid gap-4 md:gap-5">
          <Reveal>
            <p className="body-md">
              I started on Android and kept going. Today I build Kotlin Multiplatform apps with
              Compose Multiplatform: local-first storage, modules that stay out of each other's way,
              and screens that are a plain function of their state.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="body-md">
              Recently that has meant a 50+ module build, shader work in liquidglass, and pull
              requests to libraries other people depend on. I learned the basics at Appverse
              Technologies and finished a BS in Software Engineering at the University of Sargodha.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <ul className="flex flex-wrap gap-2" aria-label="Core technologies">
              {STACK.slice(0, 6).map((s) => (
                <li key={s} className="chip">
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- Story ---------- */
function Story() {
  return (
    <section id="story" aria-labelledby="story-title" className="section section--tight-bottom">
      <SectionHead
        id="story-title"
        eyebrow="02 / Path"
        title="How I got here."
        kicker="2022 – now"
      />
      <div className="container-x">
        <ol className="timeline">
          {STORY.map((t, i) => (
            <li key={t.role + t.period} className="timeline__item">
              <Reveal delay={i * 0.07}>
                <span className="timeline__dot" aria-hidden />
                <div className="timeline__body">
                  <span className={`unit timeline__period${t.current ? " status-live" : ""}`}>
                    {t.period}
                  </span>
                  <h3 className="hd-3 mt-1">{t.role}</h3>
                  <span className="eyebrow mt-1 block">{t.org}</span>
                  {t.note && <p className="body-sm mt-3 max-w-xl">{t.note}</p>}
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- Work ---------- */
function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="section">
      <SectionHead
        id="work-title"
        eyebrow="03 / Selected Work"
        title="Products, shipped."
        kicker="2025 – 2026"
      />
      <div className="container-x">
        <SpatialWork items={WORK} />
      </div>
    </section>
  );
}

/** One Lab card. Owns a pointer hook so its diorama parallaxes like the work panes. */
function LabCard({ item }: { item: (typeof LAB)[number] }) {
  const { ref, onPointerMove, onPointerLeave } = useSpatialPointer<HTMLAnchorElement>(7);
  const isExternal = Boolean("href" in item && item.href && item.href.startsWith("http"));
  return (
    <a
      ref={ref}
      href={("href" in item && item.href) || "#contact"}
      {...(isExternal ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      data-cursor={isExternal ? "Docs" : "View"}
      aria-label={`${item.title}: ${item.note} (${item.status})${isExternal ? ". View documentation (opens in a new tab)." : ""}`}
      className="lab-card glass-soft h-full rounded-[var(--radius-lg)] md:rounded-[var(--radius-xl)] p-5 md:p-7 flex flex-col justify-between min-h-[168px] md:min-h-[220px] group"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onBlur={onPointerLeave}
    >
      <span className="flex items-center justify-between">
        <span className="icon-box text-[color:var(--platinum)]/70 icon-float">
          <AnimatedIcon name={item.icon} size={20} />
        </span>
        <span className="eyebrow">{item.status}</span>
      </span>

      <span className="lab-card__art" aria-hidden>
        <LabScene variant={item.scene} />
      </span>

      <span className="block mt-6">
        <h3 className="hd-3 block">{item.title}</h3>
        <span className="body-sm mt-2 block">{item.note}</span>
        <span className="mt-3 flex items-center gap-2 eyebrow text-[color:var(--platinum)] opacity-60 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100 transition-opacity">
          {isExternal ? "Documentation" : "Explore"} <AnimatedIcon name="arrow" size={14} />
        </span>
      </span>
    </a>
  );
}

/* ---------- Lab ---------- */
function Lab() {
  return (
    <section id="lab" aria-labelledby="lab-title" className="section">
      <SectionHead
        id="lab-title"
        eyebrow="05 / Lab"
        title="Under the hood."
        kicker="Infrastructure &amp; internals"
      />
      <ul className="container-x grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
        {LAB.map((l, i) => (
          <li key={l.title} className="h-full">
            <Reveal delay={i * 0.08} className="h-full">
              <LabCard item={l} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- Marquee ---------- */
function Ribbon() {
  return (
    <div className="marquee my-[calc(var(--space-section)/2)]" aria-hidden>
      <div className="marquee__track">
        {Array.from({ length: 2 }).map((_, k) => (
          <div key={k} className="marquee__item">
            {STACK.map((s, i) => (
              <span key={`${k}-${i}`} className={i % 2 ? "marquee__item--outline" : ""}>
                {s}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Contact ---------- */
function Contact() {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function submit(e: FormEvent) {
    e.preventDefault();
    setState("sending");
    // Mailto handoff — no backend
    const body = encodeURIComponent(`From: ${form.name} <${form.email}>\n\n${form.message}`);
    const subject = encodeURIComponent(form.subject || "Project inquiry");
    setTimeout(() => {
      window.location.href = `mailto:hello@shayxo.dev?subject=${subject}&body=${body}`;
      setState("sent");
    }, 400);
  }

  const disabled = !form.name || !form.email || !form.message || state === "sending";

  return (
    <section id="contact" aria-labelledby="contact-title" className="section">
      <SectionHead
        id="contact-title"
        eyebrow="06 / Contact"
        title="Have a project in mind?"
        kicker="Product work &amp; collaborations"
      />
      <div className="container-x grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        <Reveal className="lg:col-span-4">
          <aside
            aria-label="Contact details"
            className="glass-soft h-full rounded-[var(--radius-lg)] md:rounded-[var(--radius-xl)] p-5 md:p-8 flex flex-col justify-between gap-8 md:min-h-[420px]"
          >
            <div className="space-y-6">
              <div>
                <span className="eyebrow">Email</span>
                <a
                  href="mailto:hello@shayxo.dev"
                  className="hd-3 mt-2 flex min-w-0 items-center gap-3 py-1 hover:underline underline-offset-4"
                >
                  <span className="icon-box text-[color:var(--platinum)]/70">
                    <AnimatedIcon name="mail" size={20} />
                  </span>
                  <span className="truncate">hello@shayxo.dev</span>
                </a>
              </div>
              <div>
                <span className="eyebrow">Elsewhere</span>
                <div className="mt-3 flex flex-col gap-3">
                  <a
                    href="https://github.com/shayann07"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex min-w-0 items-center gap-3 py-1.5 body-md hover:text-[color:var(--platinum)] hover:underline underline-offset-4"
                  >
                    <span className="shrink-0">
                      <AnimatedIcon name="github" size={18} />
                    </span>
                    <span className="truncate">github.com/shayann07</span>
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/shayann07"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex min-w-0 items-center gap-3 py-1.5 body-md hover:text-[color:var(--platinum)] hover:underline underline-offset-4"
                  >
                    <span className="shrink-0">
                      <AnimatedIcon name="linkedin" size={18} />
                    </span>
                    <span className="truncate">linkedin.com/in/shayann07</span>
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="pt-5 hairline-top">
              <div className="eyebrow status-live">Currently available</div>
              <div className="body-sm mt-2">Open to freelance work and collaborations.</div>
            </div>
          </aside>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-8">
          <form
            onSubmit={submit}
            aria-labelledby="contact-title"
            className="glass rounded-[var(--radius-lg)] md:rounded-[var(--radius-xl)] p-5 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5"
          >
            <div className="field md:col-span-1">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                autoComplete="name"
                required
                maxLength={80}
                className="input"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="field md:col-span-1">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                required
                type="email"
                maxLength={120}
                className="input"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="field md:col-span-2">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                name="subject"
                maxLength={140}
                className="input"
                placeholder="What is it about?"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </div>
            <div className="field md:col-span-2">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                required
                maxLength={2000}
                aria-describedby="message-hint"
                className="textarea"
                placeholder="Tell me about the project and the timeline."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <span id="message-hint" className="body-sm opacity-60">
                Max 2000 characters.
              </span>
            </div>
            <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-4 pt-2">
              <p role="status" aria-live="polite" className="eyebrow opacity-60">
                {state === "sent"
                  ? "Message handed off to your mail app."
                  : state === "sending"
                    ? "Opening your mail app…"
                    : "Opens your mail app. Nothing is stored on this site."}
              </p>
              <button
                type="submit"
                disabled={disabled}
                className="btn btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {state === "sent" ? "Sent" : state === "sending" ? "Sending…" : "Send Message"}
                {state === "idle" && <AnimatedIcon name="arrow" size={14} />}
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer className="section pt-0">
      <div className="container-x">
        <Reveal>
          <div className="wordmark-bg leading-none" aria-hidden>
            SHAYAN
          </div>
        </Reveal>
        <div className="mt-8 md:mt-10 flex flex-col md:flex-row items-center justify-between gap-3 hairline-top pt-6 text-center md:text-left">
          <div className="eyebrow">© 2026 Muhammad Shayan · Islamabad · shayxo.dev</div>
          <div className="eyebrow opacity-60">Built with TanStack Start · Motion · Tailwind v4</div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Page ---------- */
function Page() {
  const { oss } = Route.useLoaderData();
  const { scrollY } = useScroll();
  const { active } = useSectionNav();
  useIdleScenes();

  const hasOSS = Boolean(oss?.cards && oss.cards.length > 0);

  const handleAnchorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (e.target as HTMLElement).closest?.("a[href^='#']") as HTMLAnchorElement | null;
    if (!anchor) return;
    const href = anchor.getAttribute("href") ?? "";
    if (href === "#main") return;
    if (scrollToHash(href)) e.preventDefault();
  };

  return (
    <div className="grain relative isolate min-h-dvh overflow-x-clip" onClick={handleAnchorClick}>
      <ShaderBackground />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Cursor />
      <Header active={active} hasOSS={hasOSS} />
      <SpatialNav active={active} hasOSS={hasOSS} />

      <main id="main" tabIndex={-1} className="relative z-10 pb-28 md:pb-20">
        <Hero scrollY={scrollY} />
        <About />
        <Story />
        <Work />
        {hasOSS && <OpenSource data={oss} />}
        <Ribbon />
        <Lab />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}
