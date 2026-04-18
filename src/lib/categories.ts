export interface CategoryMeta {
  slug: string;
  openTdbId: number;
  name: string;
  shortName: string;
  emoji: string;
  tagline: string;
  intro: string;
  goodFor: string[];
  sampleQuestions: { q: string; a: string; difficulty: "easy" | "medium" | "hard" }[];
  relatedSlugs: string[];
}

export const categories: CategoryMeta[] = [
  {
    slug: "general-knowledge",
    openTdbId: 9,
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
    relatedSlugs: ["geography", "politics", "mythology"],
  },
  {
    slug: "science-nature",
    openTdbId: 17,
    name: "Science & Nature Trivia",
    shortName: "Science & Nature",
    emoji: "🔬",
    tagline: "Biology, physics, chemistry, and the natural world.",
    intro:
      "Science & Nature trivia covers everything from the periodic table and astrophysics to ecosystems, animal behavior, and the human body. Great for curious minds and anyone who watches more science documentaries than is strictly healthy.",
    goodFor: [
      "Biology, chemistry, and physics enthusiasts",
      "Testing high-school and college science knowledge",
      "Mixing with the Animals category for a natural-world marathon",
    ],
    sampleQuestions: [
      { q: "What is the hardest natural substance on Earth?", a: "Diamond", difficulty: "easy" },
      { q: "What is the powerhouse of the cell?", a: "Mitochondria", difficulty: "easy" },
      { q: "What is the speed of light in a vacuum (m/s)?", a: "299,792,458", difficulty: "hard" },
    ],
    relatedSlugs: ["computers", "mathematics", "animals"],
  },
  {
    slug: "geography",
    openTdbId: 22,
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
    relatedSlugs: ["history", "general-knowledge", "politics"],
  },
  {
    slug: "film",
    openTdbId: 11,
    name: "Film Trivia",
    shortName: "Film",
    emoji: "🎬",
    tagline: "Classic cinema to modern blockbusters.",
    intro:
      "Film trivia spans actors, directors, Oscar winners, box office hits, cult classics, and the lines everyone quotes but can't place. Fun for movie buffs and anyone who's logged too many hours on Letterboxd.",
    goodFor: [
      "Movie buffs and cinephiles",
      "Casual players &mdash; film trivia is often the most accessible category",
      "Pairing with Television for an entertainment marathon",
    ],
    sampleQuestions: [
      { q: "Who directed the 1994 film 'Pulp Fiction'?", a: "Quentin Tarantino", difficulty: "easy" },
      { q: "Which film won the first Academy Award for Best Picture?", a: "Wings", difficulty: "hard" },
      { q: "In 'The Matrix', which pill does Neo take?", a: "Red", difficulty: "easy" },
    ],
    relatedSlugs: ["television", "music", "celebrities"],
  },
  {
    slug: "music",
    openTdbId: 12,
    name: "Music Trivia",
    shortName: "Music",
    emoji: "🎵",
    tagline: "From Bach to Beyoncé.",
    intro:
      "Music trivia covers composers, bands, albums, lyrics, charts, and music history across classical, rock, pop, hip-hop, and more. The category rewards breadth &mdash; you don't need to know every genre, just a lot of them.",
    goodFor: [
      "Music nerds across any genre",
      "Playing with a mixed group (everyone knows something)",
      "Pairing with Film for an entertainment marathon",
    ],
    sampleQuestions: [
      { q: "Which band released the album 'The Dark Side of the Moon'?", a: "Pink Floyd", difficulty: "easy" },
      { q: "Who composed the 'Four Seasons' concertos?", a: "Antonio Vivaldi", difficulty: "medium" },
      { q: "What is Taylor Swift's debut studio album called?", a: "Taylor Swift", difficulty: "medium" },
    ],
    relatedSlugs: ["film", "television", "musicals-theatres"],
  },
  {
    slug: "television",
    openTdbId: 14,
    name: "Television Trivia",
    shortName: "Television",
    emoji: "📺",
    tagline: "Sitcoms, dramas, and everything in between.",
    intro:
      "Television trivia covers classic and modern TV: sitcoms, prestige dramas, reality shows, animated series, and the characters we can't forget. A category that rewards people who've 'just one more episode'd' a lot.",
    goodFor: [
      "Bingers and TV obsessives",
      "Mixing eras &mdash; from 'I Love Lucy' to 'Succession'",
      "Playing casually with a group",
    ],
    sampleQuestions: [
      { q: "What is the name of the coffee shop in 'Friends'?", a: "Central Perk", difficulty: "easy" },
      { q: "Who played Walter White in 'Breaking Bad'?", a: "Bryan Cranston", difficulty: "easy" },
      { q: "Which 2005 series is set in the fictional town of Stars Hollow?", a: "Gilmore Girls", difficulty: "medium" },
    ],
    relatedSlugs: ["film", "cartoons-animations", "celebrities"],
  },
  {
    slug: "video-games",
    openTdbId: 15,
    name: "Video Games Trivia",
    shortName: "Video Games",
    emoji: "🎮",
    tagline: "From 8-bit classics to AAA blockbusters.",
    intro:
      "Video games trivia covers characters, developers, platforms, franchises, and gaming history from the Atari era to today's live-service giants. A great category for anyone who's ever beaten a game in one sitting.",
    goodFor: [
      "Gamers across all generations",
      "Testing knowledge of Nintendo, PlayStation, Xbox, and PC history",
      "Pairing with Board Games or Anime for a nerd-culture marathon",
    ],
    sampleQuestions: [
      { q: "What is the name of the princess in the original 'Super Mario Bros.'?", a: "Princess Peach", difficulty: "easy" },
      { q: "Which company developed 'The Witcher 3: Wild Hunt'?", a: "CD Projekt Red", difficulty: "medium" },
      { q: "What year was the PlayStation originally released in Japan?", a: "1994", difficulty: "medium" },
    ],
    relatedSlugs: ["board-games", "anime-manga", "comics"],
  },
  {
    slug: "sports",
    openTdbId: 21,
    name: "Sports Trivia",
    shortName: "Sports",
    emoji: "⚽",
    tagline: "Every sport, every era.",
    intro:
      "Sports trivia covers professional leagues, the Olympics, championships, record holders, and the rules of sports you might not play. Wide enough to reward casual fans and specific enough to reward diehards.",
    goodFor: [
      "Sports fans across multiple leagues",
      "Testing historical champions and record holders",
      "Pairing with Geography for a world-sport combo",
    ],
    sampleQuestions: [
      { q: "How many players are on a standard soccer team on the field?", a: "11", difficulty: "easy" },
      { q: "Which country won the 2018 FIFA World Cup?", a: "France", difficulty: "easy" },
      { q: "What is the maximum break in snooker?", a: "147", difficulty: "hard" },
    ],
    relatedSlugs: ["general-knowledge", "geography", "celebrities"],
  },
  {
    slug: "computers",
    openTdbId: 18,
    name: "Computer Science Trivia",
    shortName: "Computers",
    emoji: "💻",
    tagline: "Hardware, software, and the people who made it.",
    intro:
      "Computer trivia spans programming languages, operating systems, internet history, hardware, and the pioneers who built the industry. A favorite for developers, sysadmins, and tech hobbyists.",
    goodFor: [
      "Developers and IT pros",
      "Testing your knowledge of programming languages and protocols",
      "Pairing with Gadgets or Mathematics",
    ],
    sampleQuestions: [
      { q: "What does 'HTML' stand for?", a: "HyperText Markup Language", difficulty: "easy" },
      { q: "Who is known as the founder of Linux?", a: "Linus Torvalds", difficulty: "medium" },
      { q: "What year was the first iPhone released?", a: "2007", difficulty: "easy" },
    ],
    relatedSlugs: ["science-nature", "mathematics", "gadgets"],
  },
  {
    slug: "mathematics",
    openTdbId: 19,
    name: "Mathematics Trivia",
    shortName: "Mathematics",
    emoji: "🔢",
    tagline: "Numbers, logic, and proofs.",
    intro:
      "Mathematics trivia covers arithmetic, algebra, geometry, famous theorems, and the mathematicians behind them. A smaller but punchier category &mdash; questions tend to reward precision rather than guessing.",
    goodFor: [
      "Math enthusiasts and students",
      "Mental arithmetic practice",
      "Pairing with Computers and Science & Nature",
    ],
    sampleQuestions: [
      { q: "What is the value of pi to two decimal places?", a: "3.14", difficulty: "easy" },
      { q: "What do you call a triangle with all sides equal?", a: "Equilateral", difficulty: "easy" },
      { q: "Who proved Fermat's Last Theorem in 1994?", a: "Andrew Wiles", difficulty: "hard" },
    ],
    relatedSlugs: ["science-nature", "computers", "general-knowledge"],
  },
  {
    slug: "animals",
    openTdbId: 27,
    name: "Animals Trivia",
    shortName: "Animals",
    emoji: "🐾",
    tagline: "Mammals, birds, reptiles, and weird sea creatures.",
    intro:
      "Animals trivia tests your knowledge of species, habitats, behavior, and animal record-holders. Fun for nature lovers and anyone who's gone down a Wikipedia rabbit hole about octopuses.",
    goodFor: [
      "Nature documentary fans",
      "Pairing with Science & Nature for a biology marathon",
      "Family-friendly play",
    ],
    sampleQuestions: [
      { q: "What is the fastest land animal?", a: "Cheetah", difficulty: "easy" },
      { q: "How many hearts does an octopus have?", a: "3", difficulty: "medium" },
      { q: "What is a group of crows called?", a: "A murder", difficulty: "medium" },
    ],
    relatedSlugs: ["science-nature", "geography", "general-knowledge"],
  },
  {
    slug: "mythology",
    openTdbId: 20,
    name: "Mythology Trivia",
    shortName: "Mythology",
    emoji: "⚡",
    tagline: "Gods, heroes, and the stories we still tell.",
    intro:
      "Mythology trivia covers Greek, Roman, Norse, Egyptian, and world mythologies: the gods, the heroes, and the stories that shaped literature. Great for fans of fantasy, classics, and Percy Jackson.",
    goodFor: [
      "Classics and fantasy fans",
      "Pairing with History or Books",
      "Anyone who loved Greek mythology as a kid",
    ],
    sampleQuestions: [
      { q: "Who is the Greek god of the sea?", a: "Poseidon", difficulty: "easy" },
      { q: "In Norse mythology, what is Thor's hammer called?", a: "Mjölnir", difficulty: "easy" },
      { q: "Which Egyptian goddess is often depicted with a cow's horns and a sun disk?", a: "Hathor", difficulty: "hard" },
    ],
    relatedSlugs: ["history", "books", "general-knowledge"],
  },
  {
    slug: "books",
    openTdbId: 10,
    name: "Books & Literature Trivia",
    shortName: "Books",
    emoji: "📚",
    tagline: "Authors, novels, poetry, and the classics.",
    intro:
      "Books trivia covers authors, novels, poetry, and literary movements from antiquity to modern bestsellers. Strong category for readers and literature students.",
    goodFor: [
      "Book lovers and literature students",
      "Pairing with Film (adaptations) or Mythology",
      "Testing your recall of plot details from school reading",
    ],
    sampleQuestions: [
      { q: "Who wrote 'To Kill a Mockingbird'?", a: "Harper Lee", difficulty: "easy" },
      { q: "Which Russian author wrote 'Crime and Punishment'?", a: "Fyodor Dostoevsky", difficulty: "medium" },
      { q: "In what year was the first Harry Potter book published?", a: "1997", difficulty: "easy" },
    ],
    relatedSlugs: ["film", "mythology", "general-knowledge"],
  },
  {
    slug: "art",
    openTdbId: 25,
    name: "Art Trivia",
    shortName: "Art",
    emoji: "🎨",
    tagline: "Paintings, sculptors, and art history.",
    intro:
      "Art trivia covers painters, movements, famous works, and the history of visual art from cave paintings to modernism. Fun for museum-goers and art history minors.",
    goodFor: [
      "Museum-goers and art history fans",
      "Pairing with History for a cultural marathon",
      "Testing your recognition of iconic works",
    ],
    sampleQuestions: [
      { q: "Who painted the Mona Lisa?", a: "Leonardo da Vinci", difficulty: "easy" },
      { q: "Which art movement is Salvador Dalí most associated with?", a: "Surrealism", difficulty: "easy" },
      { q: "In which city is the Rijksmuseum located?", a: "Amsterdam", difficulty: "medium" },
    ],
    relatedSlugs: ["history", "books", "general-knowledge"],
  },
  {
    slug: "anime-manga",
    openTdbId: 31,
    name: "Anime & Manga Trivia",
    shortName: "Anime & Manga",
    emoji: "🗾",
    tagline: "From Studio Ghibli to Shonen Jump.",
    intro:
      "Anime and manga trivia covers characters, creators, studios, and iconic series from Japan's animation and comic traditions. Strong category for fans of Studio Ghibli, Shonen Jump, and everything in between.",
    goodFor: [
      "Anime and manga fans",
      "Pairing with Video Games and Comics",
      "Testing recognition of famous opening themes and character names",
    ],
    sampleQuestions: [
      { q: "Who created the manga 'One Piece'?", a: "Eiichiro Oda", difficulty: "easy" },
      { q: "What is the name of the protagonist in 'Attack on Titan'?", a: "Eren Yeager", difficulty: "easy" },
      { q: "Which Studio Ghibli film features the character Totoro?", a: "My Neighbor Totoro", difficulty: "easy" },
    ],
    relatedSlugs: ["video-games", "comics", "cartoons-animations"],
  },
  {
    slug: "comics",
    openTdbId: 29,
    name: "Comics Trivia",
    shortName: "Comics",
    emoji: "🦸",
    tagline: "Superheroes, indie books, and comic lore.",
    intro:
      "Comics trivia spans Marvel, DC, and independent publishers &mdash; characters, creators, story arcs, and the films and TV shows that spun out of them. A must for fans of long-running superhero universes.",
    goodFor: [
      "Marvel and DC fans",
      "Pairing with Film and Video Games",
      "Testing your knowledge of origin stories and creators",
    ],
    sampleQuestions: [
      { q: "Who is Spider-Man's alter ego?", a: "Peter Parker", difficulty: "easy" },
      { q: "Which comic publisher created the X-Men?", a: "Marvel Comics", difficulty: "easy" },
      { q: "Who wrote the graphic novel 'Watchmen'?", a: "Alan Moore", difficulty: "medium" },
    ],
    relatedSlugs: ["film", "anime-manga", "video-games"],
  },
  {
    slug: "cartoons-animations",
    openTdbId: 32,
    name: "Cartoons & Animations Trivia",
    shortName: "Cartoons & Animations",
    emoji: "✏️",
    tagline: "From classic Disney to modern Pixar.",
    intro:
      "Cartoons and animations trivia covers Western animation: Disney, Pixar, Looney Tunes, Cartoon Network, and adult animation from The Simpsons to Rick and Morty.",
    goodFor: [
      "Fans of Disney, Pixar, and classic Saturday morning cartoons",
      "Pairing with Film and Television",
      "Family-friendly rounds (just skip adult animation)",
    ],
    sampleQuestions: [
      { q: "What is the name of the toy cowboy in 'Toy Story'?", a: "Woody", difficulty: "easy" },
      { q: "Which animated sitcom is set in Springfield?", a: "The Simpsons", difficulty: "easy" },
      { q: "Who directed 'Spirited Away'? (This tests a common crossover)", a: "Hayao Miyazaki", difficulty: "medium" },
    ],
    relatedSlugs: ["film", "television", "anime-manga"],
  },
  {
    slug: "board-games",
    openTdbId: 16,
    name: "Board Games Trivia",
    shortName: "Board Games",
    emoji: "🎲",
    tagline: "Monopoly to modern Euro-games.",
    intro:
      "Board games trivia covers classics (Monopoly, Clue, Chess) and the modern hobby-board-game renaissance (Catan, Pandemic, Wingspan). A niche but passionate category.",
    goodFor: [
      "Board game hobbyists",
      "Pairing with Video Games for a tabletop-and-digital marathon",
      "Family game night warm-ups",
    ],
    sampleQuestions: [
      { q: "How many properties are on a standard Monopoly board?", a: "28", difficulty: "medium" },
      { q: "Who designed 'Settlers of Catan'?", a: "Klaus Teuber", difficulty: "medium" },
      { q: "What is the goal of the game 'Go'?", a: "Surround more territory than your opponent", difficulty: "medium" },
    ],
    relatedSlugs: ["video-games", "general-knowledge", "mathematics"],
  },
  {
    slug: "musicals-theatres",
    openTdbId: 13,
    name: "Musicals & Theatre Trivia",
    shortName: "Musicals & Theatre",
    emoji: "🎭",
    tagline: "Broadway, West End, and beyond.",
    intro:
      "Musicals and theatre trivia covers Broadway hits, West End classics, composers, playwrights, and the shows that defined each era of live performance.",
    goodFor: [
      "Theatre kids (past and present)",
      "Pairing with Music or Film",
      "Fans of Sondheim, Lloyd Webber, and Lin-Manuel Miranda",
    ],
    sampleQuestions: [
      { q: "Who composed the music for 'Hamilton'?", a: "Lin-Manuel Miranda", difficulty: "easy" },
      { q: "In 'Les Misérables', what is the main character's prisoner number?", a: "24601", difficulty: "medium" },
      { q: "Which Sondheim musical features the song 'Send In the Clowns'?", a: "A Little Night Music", difficulty: "hard" },
    ],
    relatedSlugs: ["music", "film", "books"],
  },
  {
    slug: "politics",
    openTdbId: 24,
    name: "Politics Trivia",
    shortName: "Politics",
    emoji: "🏛️",
    tagline: "Elections, leaders, and political history.",
    intro:
      "Politics trivia covers elections, world leaders, political systems, and significant policy events &mdash; heavier on history and systems than current partisan debates.",
    goodFor: [
      "Politics and civics nerds",
      "Pairing with History and Geography",
      "Testing knowledge of world leaders across decades",
    ],
    sampleQuestions: [
      { q: "Who was the first female Prime Minister of the United Kingdom?", a: "Margaret Thatcher", difficulty: "easy" },
      { q: "How many member states are in the European Union (as of 2020)?", a: "27", difficulty: "medium" },
      { q: "Which U.S. President was the only one to resign from office?", a: "Richard Nixon", difficulty: "easy" },
    ],
    relatedSlugs: ["history", "geography", "general-knowledge"],
  },
  {
    slug: "celebrities",
    openTdbId: 26,
    name: "Celebrities Trivia",
    shortName: "Celebrities",
    emoji: "⭐",
    tagline: "Actors, musicians, and pop-culture icons.",
    intro:
      "Celebrities trivia tests your knowledge of actors, musicians, athletes, and other public figures &mdash; birthdays, careers, awards, and the occasional piece of pop-culture gossip.",
    goodFor: [
      "Pop-culture obsessives",
      "Pairing with Film, Television, and Music",
      "Casual group play",
    ],
    sampleQuestions: [
      { q: "What is Lady Gaga's real name?", a: "Stefani Germanotta", difficulty: "medium" },
      { q: "Which actor starred in 'Titanic' and 'Inception'?", a: "Leonardo DiCaprio", difficulty: "easy" },
      { q: "Who founded the Tesla electric car company?", a: "Martin Eberhard and Marc Tarpenning", difficulty: "hard" },
    ],
    relatedSlugs: ["film", "television", "music"],
  },
  {
    slug: "vehicles",
    openTdbId: 28,
    name: "Vehicles Trivia",
    shortName: "Vehicles",
    emoji: "🚗",
    tagline: "Cars, planes, trains, and ships.",
    intro:
      "Vehicles trivia covers cars, motorcycles, aircraft, trains, and ships &mdash; manufacturers, models, racing, and transportation history.",
    goodFor: [
      "Gearheads and aviation fans",
      "Pairing with Gadgets for a tech-and-transport combo",
      "Testing knowledge of F1, Le Mans, and classic cars",
    ],
    sampleQuestions: [
      { q: "Which German automaker makes the 911?", a: "Porsche", difficulty: "easy" },
      { q: "What is the top speed of a Bugatti Chiron (in mph, approx)?", a: "261", difficulty: "medium" },
      { q: "Which airline operated Concorde alongside British Airways?", a: "Air France", difficulty: "medium" },
    ],
    relatedSlugs: ["gadgets", "sports", "general-knowledge"],
  },
  {
    slug: "gadgets",
    openTdbId: 30,
    name: "Gadgets Trivia",
    shortName: "Gadgets",
    emoji: "📱",
    tagline: "Consumer tech, past and present.",
    intro:
      "Gadgets trivia covers phones, cameras, consoles, and the consumer tech that defined each decade. Lighter than Computers &mdash; more 'what' and 'when' than deep systems knowledge.",
    goodFor: [
      "Consumer-tech enthusiasts",
      "Pairing with Computers and Video Games",
      "Testing your memory of phones and gadgets you once owned",
    ],
    sampleQuestions: [
      { q: "Which company released the iPod in 2001?", a: "Apple", difficulty: "easy" },
      { q: "What was the Sony portable cassette player called?", a: "Walkman", difficulty: "easy" },
      { q: "What does 'GPS' stand for?", a: "Global Positioning System", difficulty: "easy" },
    ],
    relatedSlugs: ["computers", "vehicles", "video-games"],
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
