export type Headline = {
  id: string;
  title: string;
  timeAgo: string;
};

export type Article = {
  id: string;
  category: string;
  label?: string;
  title: string;
  subheadline?: string;
  excerpt: string;
  body: string[];
  image: string;
  imageAlt: string;
  timeAgo: string;
  author?: string;
};

export const featuredStory: Article = {
  id: "petaluma-high-scores",
  category: "EDUCATION",
  label: "INVESTIGATION",
  title: "New Report Shows Petaluma High Test Scores at Historic Low",
  subheadline:
    "Researchers say student performance has dropped dramatically, placing local scores among the lowest measured nationally.",
  excerpt:
    "A statewide review released Monday placed Petaluma High among the steepest year-over-year declines in California, with proficiency rates in math and reading falling to levels administrators described as “sobering.” District officials pledged emergency tutoring blocks and a community forum next Thursday, while parents lined the gymnasium asking whether phones, post-pandemic absences, or “whatever happened to homework” were to blame. State analysts cautioned that one report should not define a school, but conceded the numbers were “difficult to spin positively.”",
  body: [
    "PETALUMA — When Superintendent Marla Chen opened the district’s quarterly data packet Monday morning, she reportedly set her coffee down so slowly that three colleagues mistook the silence for a fire drill.",
    "The numbers were unambiguous: Petaluma High’s composite proficiency in math and English language arts had fallen to 31%, a figure that places the campus in the bottom decile statewide and, according to one analyst who asked not to be named, “somewhere between concerning and the kind of thing you put in a PowerPoint with a frowny face.”",
    "The decline did not arrive overnight. Internal dashboards reviewed by this publication show a steady slide over four years, accelerating after 2022 when chronic absenteeism climbed and a popular TikTok trend encouraged students to “study ironically.” Teachers described classrooms where participation is high but answers are “vibes-based.”",
    "Parents who packed the gymnasium Tuesday night were less interested in longitudinal charts than in explanations. “My kid says the Wi-Fi was bad during the test,” said one mother. “Our Wi-Fi is fiber. What is happening?”",
    "District leadership outlined a five-point recovery plan: mandatory tutoring blocks, Saturday math labs, a phone-collection pilot in two classrooms, and a community forum billed as “listening session / light refreshments.” A fifth point—“rebranding effort”—was crossed out on the handout but visible through the paper.",
    "State education officials urged context. “One report does not define a school,” said spokesperson Denise Holt. “That said, these are difficult numbers to spin positively. We recommend honesty, resources, and maybe fewer inspirational posters about grit.”",
    "Students interviewed outside the library were philosophical. “I’ll retake it,” said sophomore Jaylen R. “Or I’ll go into content creation. Same energy.”",
    "The school board votes next month on whether to declare an academic state of emergency, a label that would unlock supplemental funding and, according to board member Greg Fisk, “finally get us on the local news for something other than the pep band.”",
  ],
  image: "/petalumahigh.jpeg",
  imageAlt: "Petaluma High School campus",
  timeAgo: "1 hour ago",
  author: "By Elena Voss and Staff",
};

export const sideStories: Article[] = [
  {
    id: "rp-fighter-jet",
    category: "LOCAL",
    title:
      "Rohnert Park Unveils ‘Neighborhood Shield’ Fighter Jet on Retractable Lawn Mount",
    excerpt:
      "City leaders hailed the $40 million pilot program as “the future of suburban deterrence,” though FAA officials noted the jet has not left the ground and may never need to. Residents report improved sleep knowing “something loud is watching the outlet malls.”",
    body: [
      "ROHNERT PARK — At dawn Tuesday, crews lowered a decommissioned F-16 onto a hydraulic pedestal beside City Hall, completing phase one of the Neighborhood Shield initiative—a $40 million package that includes landscaping, a commemorative plaque, and “optional engine noises” on federal holidays.",
      "Mayor Toni Delgado told a crowd of roughly 200 that suburban communities deserve the same sense of security as airports, military bases, and “places that already have jets.” The aircraft, sourced from a surplus yard in Arizona, will remain permanently mounted. FAA representatives confirmed it is not airworthy and, more importantly, not going anywhere.",
      "“This is deterrence in the psychological sense,” said project consultant Hal Merritt, who previously designed mall security kiosks. “Adversaries—whether foreign or merely littering—will think twice.”",
      "Residents along Snyder Lane were divided. “I sleep better,” said retiree Phil Ortega. “Something loud is watching the outlet malls.” Others cited property values, bird noise, and the fact that the jet’s nose points directly at a yoga studio.",
      "The city council approved the program 4–1 last fall after a presentation that included a dramatic video and the phrase “peace through curb appeal.” Dissenting member Lana Cho called it “the most expensive lawn ornament in Sonoma County history,” then added, “I say that with respect for lawn ornaments.”",
      "Phase two, scheduled for 2027, would add a retractable canopy and a gift shop. Until then, visitors may photograph the jet, read interpretive signage, and sign a waiver acknowledging that “startup sounds are for ambiance only.”",
    ],
    image: "/rpfighter.jpeg",
    imageAlt: "Fighter jet display in Rohnert Park",
    timeAgo: "3 hours ago",
    author: "By Marcus Hale",
  },
  {
    id: "cotati-square-karen",
    category: "PUBLIC SAFETY",
    title:
      "Police Called to Cotati Square After Reported ‘Nail-Related Disturbance’",
    excerpt:
      "Witnesses said a woman accused a kiosk of selling “counterfeit acrylics” before addressing shoppers at random about cuticle integrity. Officers calmed the scene within twenty minutes; no injuries, one shattered sample tray.",
    body: [
      "COTATI — Dispatch logs from Saturday afternoon list the call simply as “disturbance, retail, nails,” which understates a scene witnesses described as “a TED Talk, but angry.”",
      "According to employees at a beauty kiosk near the fountain, a customer accused the shop of selling counterfeit acrylics after her manicure “did not survive a Costco sample.” The woman then addressed passing shoppers about cuticle integrity, brand ethics, and “what they teach you in Davis.”",
      "“She had charts,” said barista Leo Kim, who watched from a coffee stand. “Printed charts. About keratin.”",
      "Cotati police arrived within eight minutes. Officers separated parties, documented statements, and facilitated a refund that the kiosk owner offered “to restore peace and also because the tray was already broken.” One display of press-on samples was shattered; no injuries were reported.",
      "The woman left with a warning for disturbing the peace and a business card for a rival salon in Rohnert Park, which she told officers was “where adults go.” Mall management declined to ban her, citing “first amendment and commerce.”",
      "By evening, social media clips of the incident had accumulated thousands of views, prompting the mall to post a neutral statement about “supporting local entrepreneurs and calm cuticles.”",
    ],
    image: "/karensquare.png",
    imageAlt: "Cotati Square shopping area",
    timeAgo: "5 hours ago",
    author: "By Staff Report",
  },
];

export const localNewsStories: Article[] = [
  {
    id: "hwy-12-traffic",
    category: "TRANSPORTATION",
    title:
      "Highway 12 Backup Now Officially Measured in ‘Number of Wine Tastings Skipped’",
    excerpt:
      "CHP introduced a new commuter misery index after Tuesday’s three-hour stall between Santa Rosa and Sonoma. Drivers described the delay as “educational” if you enjoy stationary merlot introspection.",
    body: [
      "SONOMA COUNTY — California Highway Patrol unveiled a pilot “commuter misery index” Wednesday after Tuesday’s three-hour backup on Highway 12 converted dozens of weekend itineraries into roadside contemplation.",
      "Unlike traditional delay metrics measured in minutes, the new index translates gridlock into “wine tastings skipped,” “anniversary dinners cooled,” and “children asking if we live in the car now.” Tuesday’s peak registered 4.7 tastings, a figure CHP called “historic for a weekday.”",
      "The stall began near Glen Ellen when a delivery truck and a vintage convertible both attempted to occupy a lane shaped like a question mark. Tow trucks arrived slowly; drivers posted updates with hashtags and snack reviews.",
      "“We missed our 2 p.m. reservation,” said Santa Rosa resident Nina Cho. “We made a 5 p.m. reservation called ‘standing in the gravel shoulder.’ Educational, if you like merlot introspection without glasses.”",
      "Tourism officials worry the index will trend on travel blogs. “We prefer ‘scenic pause,’” said a Visit Sonoma spokesperson. CHP insists the metric is educational. Commuters insist it is accurate.",
      "Caltrans said long-term fixes remain in study phases that predate several governors. Until then, officials recommend leaving early, packing water, and lowering expectations to “we saw a hawk.”",
    ],
    image: "/sonoma-traffic.jpg",
    imageAlt: "Traffic on a Sonoma County wine country road",
    timeAgo: "7 hours ago",
    author: "By Traffic Desk",
  },
  {
    id: "sebastopol-chicken",
    category: "COMMUNITY",
    title:
      "Sebastopol Farmers Market Issues All-Points Bulletin for ‘Very Opinionated’ Rooster",
    excerpt:
      "Vendors say the bird has vetoed three squash displays and “auditioned” for a kombucha booth. Animal control requests tips, preferably not in crow format.",
    body: [
      "SEBASTOPOL — Organizers of the Sunday farmers market issued an all-points bulletin Thursday for a Rhode Island Red described in official paperwork as “loud, persuasive, and not enrolled in any vendor program.”",
      "Witnesses say the rooster arrived before dawn with no handler, inspected squash displays, and rejected three arrangements on grounds only he understands. He later perched near a kombucha booth long enough that the brewer added “with attitude” to a chalkboard sign.",
      "“He crowed during the mayor’s zucchini speech,” said honey vendor Pat Leung. “People applauded. We’re not sure for whom.”",
      "Animal control has received eleven calls. Officers ask the public for tips, photos, or “any information not delivered exclusively in crow format.” The bird is not considered dangerous, merely “highly committed to standards.”",
      "Market rules require animals to be leashed or licensed. The rooster qualifies as neither and has evaded nets twice by ducking under folding tables.",
      "Until captured, organizers will station volunteers with organic kale as distraction. “We respect his opinions,” said market chair Dana Ruiz. “We need the parking lot back.”",
    ],
    image: "/sebastopol-chicken.jpg",
    imageAlt: "Farmers market scene in Sebastopol",
    timeAgo: "9 hours ago",
    author: "By Community Desk",
  },
  {
    id: "cotati-tube-man",
    category: "CITY HALL",
    title:
      "Deflated Tube Man in Cotati Plaza Declared ‘Passive-Aggressive Landmark’",
    excerpt:
      "Maintenance crews promised inflation by Friday; locals have begun leaving coffee cups in its floppy arms. The mayor called it “a metaphor we didn’t ask for.”",
    body: [
      "COTATI — The wavy-arm inflatable outside Plaza Park entered its third day fully deflated Monday, prompting the city council to debate whether the sagging figure qualifies as public art, neglect, or “a mood.”",
      "Maintenance crews blamed a faulty blower motor and promised reinflation by Friday. Until then, residents have treated the tube man like a communal coat rack—coffee cups, flyers, and one scarf “for emotional support.”",
      "Mayor Jamie Ortiz called the scene “a metaphor we didn’t ask for” during a press briefing that was otherwise about potholes. Tourism boosters disagreed, suggesting the slumped mascot “reflects authentic humanity.”",
      "Instagram posts tagged #TubeManTherapy gained traction among local teens. A petition to keep him permanently deflated gathered 400 signatures before the creator admitted they “liked the vibe.”",
      "Business owners near the plaza report mixed effects: foot traffic is up, but several tourists asked if the town is closed. The hardware store across the street began selling miniature desktop tube men “for office morale.”",
      "City staff estimate repair costs at $1,200. Council member Cho suggested replacing the motor and adding a plaque reading “We tried.” Vote scheduled for next week.",
    ],
    image: "/cotati-fog-plaza.jpg",
    imageAlt: "Foggy plaza in Cotati",
    timeAgo: "12 hours ago",
    author: "By City Desk",
  },
];

export const entertainmentStories: Article[] = [
  {
    id: "johnny-oliver-statue",
    category: "ENTERTAINMENT",
    title:
      "Downtown Santa Rosa Statue of Johnny Oliver Vandalized Overnight; Suspects Left Pretentious Note",
    excerpt:
      "The bronze likeness—commissioned to honor “a regional icon of questionable genre boundaries”—was found at dawn with novelty sunglasses welded on and a spray-painted quote attributed to “the real Oliver.” Police are reviewing security footage from a nearby guitar shop that may have been “emotionally involved.”",
    body: [
      "SANTA ROSA — Custodians arriving at Old Courthouse Square discovered the city’s bronze tribute to Johnny Oliver wearing welded novelty sunglasses and a spray-painted quote officials described as “pretentious, possibly accurate.”",
      "The statue—commissioned last year to honor “a regional icon of questionable genre boundaries”—depicts Oliver mid-strum with a expression critics called “confident” and fans called “exactly right.” Overnight vandals added accessories and a note taped to the pedestal reading, “Art should challenge; yours challenged my lunch.”",
      "Police are reviewing footage from a guitar shop across the street whose owner declined comment but was seen tuning an acoustic instrument “with feeling.” Arts council president Lila Marsh condemned the damage while admitting foot traffic tripled before noon.",
      "“Tragic for bronze,” Marsh said. “Excellent for civic engagement.”",
      "Restoration could cost $18,000, mostly to remove welding without harming patina. A crowdfunding campaign launched by fans exceeded its goal in four hours, with donors requesting the sunglasses remain as “limited edition canon.”",
      "City attorneys are studying whether the note constitutes confession, commentary, or marketing. Oliver’s publicist issued a statement that was one winking emoji and the words “no comment, yes encore.”",
      "Tour guides already added the vandalism to downtown walking routes. By press time, a second note appeared reading, “See you at the plaza, 8 p.m., bring capo.” Security has been increased; vibe has not.",
    ],
    image: "/johnnyoliver.png",
    imageAlt: "Johnny Oliver statue in downtown Santa Rosa",
    timeAgo: "4 hours ago",
    author: "By Arts & Culture Desk",
  },
];

export const extraHeadlineArticles: Article[] = [
  {
    id: "healdsburg-fountain",
    category: "GOVERNMENT",
    title: "Healdsburg Council Debates Whether Fountain Is ‘Too Fancy for Ducks’",
    excerpt:
      "A proposed plaza renovation includes LED lighting and classical jets; wildlife advocates say ducks deserve “honest water.”",
    body: [
      "HEALDSBURG — City council spent Tuesday evening debating whether a proposed $2.3 million plaza fountain upgrade is “too fancy for ducks,” a phrase that appeared in public comment seventeen times.",
      "The design includes LED rings, synchronized jets, and a filtration system marketed as “museum-grade.” Supporters say downtown deserves a centerpiece that photographs well. Opponents, including several ducks who could not speak but were represented, prefer “honest water.”",
      "Biologist guest speaker Dr. Amy Kent testified that waterfowl adapt but “do not need a light show.” Realtor groups countered that property values respond to aesthetics, not “avian minimalism.”",
      "Mayor Pauline Ruiz attempted compromise: fancy fountain by day, simple pool mode at dusk. Engineers said the modes are possible but “the ducks won’t know which shift they’re on.”",
      "Council tabled the vote until a duck-impact study returns. Meanwhile, existing fountain water remains on, modest, and heavily photographed.",
    ],
    image: "/cotati-fog-plaza.jpg",
    imageAlt: "Plaza fountain in wine country",
    timeAgo: "14 hours ago",
    author: "By Government Desk",
  },
  {
    id: "petaluma-rooster-eviction",
    category: "NEIGHBORHOODS",
    title: "Petaluma Rooster Refuses Eviction Notice, Cites Agricultural Heritage",
    excerpt:
      "The bird’s attorney—also the owner’s nephew—filed a motion to dismiss citing “precedent set by chickens everywhere.”",
    body: [
      "PETALUMA — A Rhode Island Red named Governor has refused to vacate a suburban backyard after neighbors served a formal complaint about pre-dawn performances.",
      "Owner Teresa Wu says the rooster is family. The neighborhood association says the rooster is “a zoning incident with feathers.” An eviction notice taped to the coop was pecked apart within hours.",
      "Legal representation comes courtesy of Wu’s nephew, Dylan, a first-year law student who filed a motion citing agricultural heritage, emotional support, and “precedent set by chickens everywhere.”",
      "City code allows limited poultry with permits. Governor’s permit application includes a paw print that may or may not be his. A hearing is set for next month; residents are advised to bring earplugs and popcorn.",
    ],
    image: "/sebastopol-chicken.jpg",
    imageAlt: "Rooster in a neighborhood setting",
    timeAgo: "1 day ago",
    author: "By Neighborhoods Desk",
  },
];

export function getAllArticles(): Article[] {
  return [
    featuredStory,
    ...entertainmentStories,
    ...sideStories,
    ...localNewsStories,
    ...extraHeadlineArticles,
  ];
}

export function getArticleById(id: string): Article | undefined {
  return getAllArticles().find((a) => a.id === id);
}

export const latestHeadlines: Headline[] = [
  { id: featuredStory.id, title: featuredStory.title, timeAgo: featuredStory.timeAgo },
  {
    id: entertainmentStories[0].id,
    title: entertainmentStories[0].title,
    timeAgo: entertainmentStories[0].timeAgo,
  },
  { id: sideStories[0].id, title: sideStories[0].title, timeAgo: sideStories[0].timeAgo },
  { id: sideStories[1].id, title: sideStories[1].title, timeAgo: sideStories[1].timeAgo },
  {
    id: localNewsStories[0].id,
    title: localNewsStories[0].title,
    timeAgo: localNewsStories[0].timeAgo,
  },
  {
    id: localNewsStories[1].id,
    title: localNewsStories[1].title,
    timeAgo: localNewsStories[1].timeAgo,
  },
  {
    id: extraHeadlineArticles[0].id,
    title: extraHeadlineArticles[0].title,
    timeAgo: extraHeadlineArticles[0].timeAgo,
  },
  {
    id: extraHeadlineArticles[1].id,
    title: extraHeadlineArticles[1].title,
    timeAgo: extraHeadlineArticles[1].timeAgo,
  },
];
