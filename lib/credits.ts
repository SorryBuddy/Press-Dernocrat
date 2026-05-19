export type CreditPerson = {
  id: string;
  name: string;
  role: string;
  description: string;
  image?: string;
  /** Shown in the avatar circle when there is no image (e.g. "N/A"). */
  avatarLabel?: string;
  initials?: string;
};

export const creditTeam: CreditPerson[] = [
  {
    id: "jordan-herrera",
    name: "Jordan Herrera",
    role: "Editor-in-Chief",
    description:
      "Created the idea for Press Dernocrat Daily—the social media, the website, and the rest—and recruited Joel Mulonde to help run it.",
    image: "/jordan.png",
  },
  {
    id: "joel-mulonde",
    name: "Joel Mulonde",
    role: "Digital Director",
    description:
      "Helps run the social media and works on the website with Jordan—keeping posts timely, pages updated, and the chaos at least somewhat organized.",
    image: "/joel.png",
  },
  {
    id: "sir-gpt",
    name: "Sir GPT",
    role: "Automated Correspondent",
    description:
      "An AI assistant who may have pitched in on image generation, coding the website, and a headline or two—then insisted it was only \"assistive.\"",
    image: "/sir-gpt.svg",
  },
];
