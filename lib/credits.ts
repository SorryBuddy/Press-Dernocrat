export type CreditPerson = {
  id: string;
  name: string;
  role: string;
  description: string;
  image?: string;
  initials?: string;
};

export const creditTeam: CreditPerson[] = [
  {
    id: "jordan-herrera",
    name: "Jordan Herrera",
    role: "Editor-in-Chief",
    description:
      "Created the idea for Press Dernocrat Daily—the social media, the website, and the rest of the operation—and recruited Joel Mulonde to help bring it to life.",
    initials: "JH",
  },
  {
    id: "joel-mulonde",
    name: "Joel Mulonde",
    role: "Digital Director",
    description:
      "Helps run the social media and works on the website with Jordan. The other half of keeping the feed updated and the site standing.",
    initials: "JM",
  },
  {
    id: "sir-gpt",
    name: "Sir GPT",
    role: "Automated Correspondent",
    description:
      "A neural knight errant who may have had a role or two in image generation and coding the website—among other odd-hour duties. Knighted for services to absurdity and insists it was only \"assistive.\"",
    image: "/sir-gpt.svg",
  },
];
