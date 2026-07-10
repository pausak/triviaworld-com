export interface CategoryMeta {
  slug: string;
  openTdbId: number; // stable numeric id used across the app + /play?category=<id>
  triviaApiCategory: string; // The Trivia API category slug this maps to
  name: string;
  shortName: string;
  emoji: string;
  tagline: string;
  intro: string;
  goodFor: string[];
  sampleQuestions: { q: string; a: string; difficulty: "easy" | "medium" | "hard" }[];
  relatedSlugs: string[];
}

// These are the 10 categories The Trivia API actually backs. Each drives both
// the in-game picker and its /trivia/<slug> SEO page. Older, narrower categories
// (video games, anime, etc.) were consolidated here and 301-redirect via
// next.config.ts.
export const categories: CategoryMeta[] = [
  {
    slug: "general-knowledge",
    openTdbId: 9,
    triviaApiCategory: "general_knowledge",
    name: "General Knowledge Trivia",
    shortName: "General Knowledge",
    emoji: "🧠",
    tagline: "A little bit of everything.",
    intro:
      "General knowledge trivia spans history, science, pop culture, geography, and the small facts that make great pub quizzes. It's the broadest category on TriviaWorld and the best place to start if you're not sure which rabbit hole to go down.",
    goodFor: [
      "Warming up before tackling a specialized category",
      "Playing with friends who have different interests",
      "Daily-challenge style variety",
    ],
    sampleQuestions: [
      { q: "What is the largest ocean on Earth?", a: "Pacific Ocean", difficulty: "easy" },
      { q: "Which element has the chemical symbol 'Au'?", a: "Gold", difficulty: "easy" },
      { q: "In what year did the Berlin Wall fall?", a: "1989", difficulty: "medium" },
    ],
    relatedSlugs: ["history", "science-nature", "geography"],
  },
  {
    slug: "history",
    openTdbId: 23,
    triviaApiCategory: "history",
    name: "History Trivia",
    shortName: "History",
    emoji: "📜",
    tagline: "From ancient empires to the 20th century.",
    intro:
      "History trivia ranges from ancient civilizations and medieval Europe to world wars and modern political history. Questions tend to reward a good sense of dates, names, and cause-and-effect across eras.",
    goodFor: [
      "Testing how much of school history actually stuck",
      "Fans of documentaries, biographies, and historical fiction",
      "Building long streaks &mdash; history questions tend to cluster by era",
    ],
    sampleQuestions: [
      { q: "Who was the first President of the United States?", a: "George Washington", difficulty: "easy" },
      { q: "In which year did World War I begin?", a: "1914", difficulty: "easy" },
      { q: "Which treaty ended the Thirty Years' War?", a: "Peace of Westphalia", difficulty: "hard" },
    ],
    relatedSlugs: ["geography", "society-and-culture", "arts-and-literature"],
  },
  {
    slug: "science-nature",
    openTdbId: 17,
    triviaApiCategory: "science",
    name: "Science & Nature Trivia",
    shortName: "Science & Nature",
    emoji: "🔬",
    tagline: "Biology, physics, chemistry, tech, and the natural world.",
    intro:
      "Science & Nature trivia covers everything from the periodic table and astrophysics to ecosystems, animal behavior, computing, and the human body. It's the home for the sciences, mathematics, technology, and the natural world &mdash; great for curious minds and anyone who watches more science documentaries than is strictly healthy.",
    goodFor: [
      "Biology, chemistry, physics, and computing enthusiasts",
      "Testing high-school and college science knowledge",
      "Nature-documentary fans and animal lovers",
    ],
    sampleQuestions: [
      { q: "What is the hardest natural substance on Earth?", a: "Diamond", difficulty: "easy" },
      { q: "What is the powerhouse of the cell?", a: "Mitochondria", difficulty: "easy" },
      { q: "What is the fastest land animal?", a: "Cheetah", difficulty: "easy" },
    ],
    relatedSlugs: ["geography", "general-knowledge", "food-and-drink"],
  },
  {
    slug: "geography",
    openTdbId: 22,
    triviaApiCategory: "geography",
    name: "Geography Trivia",
    shortName: "Geography",
    emoji: "🌍",
    tagline: "Maps, capitals, landmarks, and the shape of the world.",
    intro:
      "Geography trivia tests your knowledge of countries, capitals, rivers, mountains, and the features that make the world navigable. A strong category for anyone who's ever stared at a map for fun.",
    goodFor: [
      "Travelers and map nerds",
      "Pairing with History for a world-building combo",
      "Teaching yourself the countries you keep confusing",
    ],
    sampleQuestions: [
      { q: "What is the capital of Australia?", a: "Canberra", difficulty: "medium" },
      { q: "Which is the longest river in the world?", a: "Nile", difficulty: "medium" },
      { q: "What is the smallest country in the world?", a: "Vatican City", difficulty: "easy" },
    ],
    relatedSlugs: ["history", "general-knowledge", "food-and-drink"],
  },
  {
    slug: "film-and-tv",
    openTdbId: 11,
    triviaApiCategory: "film_and_tv",
    name: "Film & TV Trivia",
    shortName: "Film & TV",
    emoji: "🎬",
    tagline: "Classic cinema, modern blockbusters, and the best of television.",
    intro:
      "Film & TV trivia spans actors, directors, Oscar winners, box-office hits, cult classics, sitcoms, prestige dramas, and the lines everyone quotes but can't quite place. From 'Casablanca' to 'Succession', it's the home for movie buffs and binge-watchers alike.",
    goodFor: [
      "Movie buffs, cinephiles, and TV obsessives",
      "Casual players &mdash; entertainment trivia is often the most accessible",
      "Pairing with Music for an all-entertainment marathon",
    ],
    sampleQuestions: [
      { q: "Who directed the 1994 film 'Pulp Fiction'?", a: "Quentin Tarantino", difficulty: "easy" },
      { q: "In 'The Matrix', which pill does Neo take?", a: "Red", difficulty: "easy" },
      { q: "What is the name of the coffee shop in 'Friends'?", a: "Central Perk", difficulty: "easy" },
    ],
    relatedSlugs: ["music", "arts-and-literature", "society-and-culture"],
  },
  {
    slug: "music",
    openTdbId: 12,
    triviaApiCategory: "music",
    name: "Music Trivia",
    shortName: "Music",
    emoji: "🎵",
    tagline: "From Bach to Beyoncé.",
    intro:
      "Music trivia covers composers, bands, albums, lyrics, charts, and music history across classical, rock, pop, hip-hop, and more. The category rewards breadth &mdash; you don't need to know every genre, just a lot of them.",
    goodFor: [
      "Music nerds across any genre",
      "Playing with a mixed group (everyone knows something)",
      "Pairing with Film & TV for an entertainment marathon",
    ],
    sampleQuestions: [
      { q: "Which band released the album 'The Dark Side of the Moon'?", a: "Pink Floyd", difficulty: "easy" },
      { q: "Who composed the 'Four Seasons' concertos?", a: "Antonio Vivaldi", difficulty: "medium" },
      { q: "'Billie Jean' is a song by which musician?", a: "Michael Jackson", difficulty: "easy" },
    ],
    relatedSlugs: ["film-and-tv", "arts-and-literature", "society-and-culture"],
  },
  {
    slug: "sport-and-leisure",
    openTdbId: 21,
    triviaApiCategory: "sport_and_leisure",
    name: "Sport & Leisure Trivia",
    shortName: "Sport & Leisure",
    emoji: "⚽",
    tagline: "Every sport, every era &mdash; plus games and pastimes.",
    intro:
      "Sport & Leisure trivia covers professional leagues, the Olympics, championships, and record holders, alongside board games, card games, and the pastimes people play the world over. Wide enough to reward casual fans and specific enough to reward diehards.",
    goodFor: [
      "Sports fans across multiple leagues",
      "Board-game and tabletop hobbyists",
      "Pairing with Geography for a world-sport combo",
    ],
    sampleQuestions: [
      { q: "How many players are on a standard soccer team on the field?", a: "11", difficulty: "easy" },
      { q: "Which country won the 2018 FIFA World Cup?", a: "France", difficulty: "easy" },
      { q: "What is the maximum break in snooker?", a: "147", difficulty: "hard" },
    ],
    relatedSlugs: ["general-knowledge", "geography", "society-and-culture"],
  },
  {
    slug: "arts-and-literature",
    openTdbId: 10,
    triviaApiCategory: "arts_and_literature",
    name: "Arts & Literature Trivia",
    shortName: "Arts & Literature",
    emoji: "📚",
    tagline: "Authors, novels, paintings, and the classics.",
    intro:
      "Arts & Literature trivia covers authors, novels, poetry, and literary movements alongside painters, sculptors, famous works, and the history of visual art. From antiquity to modern bestsellers and cave paintings to modernism, it's the category for readers and museum-goers.",
    goodFor: [
      "Book lovers, literature students, and art history fans",
      "Pairing with History for a cultural marathon",
      "Testing your recall of plot details and iconic works",
    ],
    sampleQuestions: [
      { q: "Who wrote 'To Kill a Mockingbird'?", a: "Harper Lee", difficulty: "easy" },
      { q: "Who painted the Mona Lisa?", a: "Leonardo da Vinci", difficulty: "easy" },
      { q: "Which Russian author wrote 'Crime and Punishment'?", a: "Fyodor Dostoevsky", difficulty: "medium" },
    ],
    relatedSlugs: ["history", "film-and-tv", "music"],
  },
  {
    slug: "society-and-culture",
    openTdbId: 24,
    triviaApiCategory: "society_and_culture",
    name: "Society & Culture Trivia",
    shortName: "Society & Culture",
    emoji: "🏛️",
    tagline: "Traditions, mythology, politics, and famous figures.",
    intro:
      "Society & Culture trivia spans world mythologies, religions, languages, customs, politics, and the public figures who shape the times. From Greek gods and world leaders to celebrities and cultural traditions, it rewards a broad curiosity about people and how they live.",
    goodFor: [
      "Fans of mythology, classics, and world cultures",
      "Politics and civics nerds",
      "Pop-culture and celebrity buffs",
    ],
    sampleQuestions: [
      { q: "Who is the Greek god of the sea?", a: "Poseidon", difficulty: "easy" },
      { q: "Which U.S. President was the only one to resign from office?", a: "Richard Nixon", difficulty: "easy" },
      { q: "In Norse mythology, what is Thor's hammer called?", a: "Mjölnir", difficulty: "easy" },
    ],
    relatedSlugs: ["history", "geography", "arts-and-literature"],
  },
  {
    slug: "food-and-drink",
    openTdbId: 33,
    triviaApiCategory: "food_and_drink",
    name: "Food & Drink Trivia",
    shortName: "Food & Drink",
    emoji: "🍔",
    tagline: "Cuisine, cocktails, and cooking from around the world.",
    intro:
      "Food & Drink trivia covers world cuisines, ingredients, cooking techniques, cocktails, wine, and the dishes that define each culture. A tasty category for home cooks, foodies, and anyone who's ever fallen down a recipe rabbit hole.",
    goodFor: [
      "Home cooks and restaurant regulars",
      "Cocktail and wine enthusiasts",
      "Pairing with Geography for a culinary world tour",
    ],
    sampleQuestions: [
      { q: "What alcoholic drink is made from molasses?", a: "Rum", difficulty: "easy" },
      { q: "Which country is the origin of the dish paella?", a: "Spain", difficulty: "easy" },
      { q: "What type of pastry is used to make profiteroles?", a: "Choux", difficulty: "medium" },
    ],
    relatedSlugs: ["geography", "science-nature", "general-knowledge"],
  },
];

export function getCategoryBySlug(slug: string): CategoryMeta | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getRelatedCategories(slug: string): CategoryMeta[] {
  const cat = getCategoryBySlug(slug);
  if (!cat) return [];
  return cat.relatedSlugs
    .map((s) => getCategoryBySlug(s))
    .filter((c): c is CategoryMeta => Boolean(c));
}
