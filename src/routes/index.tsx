import { createFileRoute } from "@tanstack/react-router";
import { NumerologyLanding } from "@/components/numerology-landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Free Personalized Numerology Report | NUMINA" },
      { name: "description", content: "Get a free personalized numerology report and explore insights into your personality, career, relationships, personal growth and important life cycles." },
      { property: "og:title", content: "Free Personalized Numerology Report | NUMINA" },
      { property: "og:description", content: "Explore your personality, career, relationships and personal cycles with a thoughtful personalized numerology report." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://your-domain.com/" }],
  }),
  component: NumerologyLanding,
});
