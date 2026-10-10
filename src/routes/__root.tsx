import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

const SITE_URL = "https://shayxo.dev";

/**
 * Featured work as structured data. Each entry mirrors a card in Selected Work,
 * so search engines can surface the projects themselves rather than only the page.
 * Kept in sync by hand with WORK in routes/index.tsx.
 */
const PROJECT_SCHEMA = [
  {
    name: "Medly",
    description:
      "Prescription scanning with Gemini OCR, RxNorm drug verification, and two-stage dose reminders.",
    languages: ["Kotlin"],
    keywords: ["Android", "Gemini", "Room", "AlarmManager"],
    url: undefined,
  },
  {
    name: "InvoiceOne",
    description:
      "Local-first invoicing on a 34-module Kotlin Multiplatform build targeting Android, desktop, web and iOS.",
    languages: ["Kotlin"],
    keywords: ["Kotlin Multiplatform", "Jetpack Compose", "Room", "Dagger Hilt"],
    url: undefined,
  },
  {
    name: "LeafBloom",
    description:
      "On-device crop disease and pest diagnosis with PyTorch Mobile inference under 50ms per frame.",
    languages: ["Kotlin"],
    keywords: ["PyTorch Mobile", "CameraX", "Gemini", "On-device ML"],
    url: undefined,
  },
  {
    name: "Upscaly",
    description:
      "Open-source Real-ESRGAN image and video upscaling that runs entirely on the user's own GPU.",
    languages: ["TypeScript", "Rust"],
    keywords: ["Real-ESRGAN", "Tauri", "React", "Vulkan", "ncnn"],
    url: "https://github.com/shayann07/Upscaly",
  },
  {
    name: "StreamBox",
    description:
      "IPTV and VOD across phone, tablet, Android TV and Fire TV on a Media3 pipeline, with a CodeIgniter 4 panel.",
    languages: ["Kotlin", "PHP"],
    keywords: ["Media3", "ExoPlayer", "CodeIgniter", "IPTV"],
    url: undefined,
  },
  {
    name: "Medicare",
    description:
      "Flutter telehealth with specialist booking, native Stripe checkout, and a GPT-4o-mini triage assistant.",
    languages: ["Dart"],
    keywords: ["Flutter", "GetX", "Stripe", "Firebase"],
    url: "https://github.com/shayann07/medicare_app_flutter",
  },
  {
    name: "GitPulse",
    description:
      "Schedules GitHub commits from Android using OAuth with the token sealed in EncryptedSharedPreferences.",
    languages: ["Kotlin"],
    keywords: ["GitHub OAuth", "WorkManager", "Android"],
    url: undefined,
  },
].map((p, i) => ({
  "@type": "SoftwareSourceCode",
  "@id": `${SITE_URL}/#project-${i + 1}`,
  name: p.name,
  description: p.description,
  programmingLanguage: p.languages,
  keywords: p.keywords,
  author: { "@id": `${SITE_URL}/#person` },
  ...(p.url ? { codeRepository: p.url } : {}),
}));

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "Muhammad Shayan" },
      { name: "theme-color", content: "#0b0b0e" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Muhammad Shayan" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: `${SITE_URL}/og-image.png` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Muhammad Shayan — Software Engineer" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${SITE_URL}/og-image.png` },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": `${SITE_URL}/#website`,
              url: SITE_URL,
              name: "Muhammad Shayan",
              inLanguage: "en",
              publisher: { "@id": `${SITE_URL}/#person` },
            },
            {
              "@type": "ProfilePage",
              "@id": `${SITE_URL}/#page`,
              url: SITE_URL,
              name: "Muhammad Shayan — Software Engineer",
              isPartOf: { "@id": `${SITE_URL}/#website` },
              about: { "@id": `${SITE_URL}/#person` },
              inLanguage: "en",
            },
            ...PROJECT_SCHEMA,
            {
              "@type": "Person",
              "@id": `${SITE_URL}/#person`,
              name: "Muhammad Shayan",
              jobTitle: "Software Engineer",
              url: SITE_URL,
              image: `${SITE_URL}/og-image.png`,
              email: "mailto:hello@shayxo.dev",
              sameAs: ["https://github.com/shayann07", "https://www.linkedin.com/in/shayann07"],
              description:
                "Software engineer shipping product systems end to end — Kotlin Multiplatform clients, backend services, payment rails, and on-device ML.",
              knowsAbout: [
                "Kotlin Multiplatform",
                "Kotlin",
                "Jetpack Compose",
                "Flutter",
                "Node.js",
                "Firebase",
                "On-device machine learning",
                "Payment integration",
              ],
              address: {
                "@type": "PostalAddress",
                addressLocality: "Islamabad",
                addressCountry: "PK",
              },
            },
          ],
        }),
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
      // SVG first for browsers that prefer it; .ico is the legacy fallback.
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "canonical", href: SITE_URL },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/* Without JS the reveal classes never get `.is-revealed` and framer-motion never
            settles its initial transforms, so the server-rendered copy would stay invisible.
            Force everything to its resting state instead. */}
        <noscript>
          <style>{`
            .reveal { opacity: 1 !important; transform: none !important; }
            .char-mask > * { transform: none !important; }
            .work-pane, .proof-chip { opacity: 1 !important; }
          `}</style>
        </noscript>
      </head>
      <body className="bg-background text-foreground antialiased font-sans">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
