export type RiskGameInfo = {
  slug: string;
  href: string;
  title: string;
  description: string;
  tag: string;
};

export const riskGames: RiskGameInfo[] = [
  {
    slug: "slots",
    href: "/risk-taking/slots",
    title: "Slots",
    description: "Pull the lever. Watch the reels blur. Pray to the neon gods.",
    tag: "Spin",
  },
  {
    slug: "wheel-of-misfortune",
    href: "/risk-taking/wheel-of-misfortune",
    title: "Wheel of Misfortune",
    description:
      "Biased toward chaos. Land on punishments or rare rewards you might actually do IRL.",
    tag: "Fate",
  },
];
