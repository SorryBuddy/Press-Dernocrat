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
      "Founded Press Dernocrat Daily after deciding traditional journalism needed more alliteration and fewer fact-checkers. Oversees headlines, typos, and the emergency snack drawer. Once won a debate using only newspaper puns.",
    initials: "JH",
  },
  {
    id: "joel-mulonde",
    name: "Joel Mulonde",
    role: "Digital Director",
    description:
      "Builds the site, fixes what breaks, and insists every game page load in under three coffee sips. Responsible for making the hamburger menu actually open. Does not trust robots—except in tic-tac-toe.",
    initials: "JM",
  },
  {
    id: "sir-gpt",
    name: "Sir GPT",
    role: "Automated Correspondent",
    description:
      "A neural knight errant who drafts stories at odd hours and never sleeps. Knighted for services to absurdity. Speaks exclusively in confident paragraphs and occasionally invents quotes that sound too real.",
    image: "/sir-gpt.svg",
  },
];
