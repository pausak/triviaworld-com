export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  author: string;
  tags: string[];
  content: string;
}

export const posts: BlogPost[] = [
  {
    slug: "hardest-science-trivia-questions",
    title: "The 10 Hardest Science Trivia Questions (and Why They Trip Everyone Up)",
    description:
      "A walkthrough of ten brutally hard science trivia questions, what makes them difficult, and the knowledge gaps they reveal.",
    date: "2026-04-15",
    readingTime: "6 min read",
    author: "The TriviaWorld Team",
    tags: ["science", "trivia-strategy"],
    content: `
Most trivia questions are won or lost in the first second &mdash; your brain either has the fact or it doesn't. But a specific class of science trivia questions is hard in a different way: they feel answerable but hinge on a detail you never quite learned. Here are ten of them, and what you can do about it.

## 1. How many bones are in the adult human body?

**Answer:** 206.

Everyone thinks they know this one, but a surprising number of players guess 200, 212, or 208. The confusion comes from the fact that babies are born with around 270 bones that fuse during development. The "adult" qualifier matters.

## 2. What is the speed of light in a vacuum?

**Answer:** 299,792,458 meters per second (or ~186,282 miles per second).

Most people approximate to "about 300,000 km/s" &mdash; and that's usually enough &mdash; but trivia questions occasionally want the precise figure. Worth memorizing the exact number.

## 3. What is the chemical symbol for tungsten?

**Answer:** W.

The symbol derives from the element's old German name, *Wolfram*. This is a common stumper because it breaks the pattern where English chemical symbols usually match the first letters of the English name.

## 4. How many elements are in the periodic table as of today?

**Answer:** 118.

The count changes slowly over time as new superheavy elements are synthesized. Tennessine (117) and Oganesson (118) were added in 2016.

## 5. What unit measures the loudness of sound?

**Answer:** Decibel.

The trick here is that players sometimes say "hertz" (which measures frequency, not loudness). Another common wrong answer is "phon," which does measure perceived loudness but isn't the standard unit.

## 6. What's the largest organ in the human body?

**Answer:** The skin.

This is often missed because people think of internal organs first. The skin of an average adult weighs about 8 pounds and covers roughly 22 square feet.

## 7. How old is the Earth?

**Answer:** Approximately 4.54 billion years.

Trivia accepts answers from ~4.5 to ~4.6 billion. The precision comes from radiometric dating of meteorites and the oldest Earth minerals.

## 8. What gas makes up the largest percentage of Earth&rsquo;s atmosphere?

**Answer:** Nitrogen (about 78%).

People instinctively say oxygen because we breathe it. Oxygen is only ~21% of the atmosphere.

## 9. What is the smallest unit of matter that retains the properties of an element?

**Answer:** An atom.

Molecules, electrons, and ions are common wrong answers. The key word is "retains the properties of an element" &mdash; splitting an atom changes the element.

## 10. What is absolute zero in Celsius?

**Answer:** &minus;273.15 &deg;C (0 Kelvin).

Most people round to &minus;273 but some trivia sources want the full figure. If you remember the Kelvin conversion formula you can always derive it.

## How to prepare

If you're serious about climbing the [Science & Nature leaderboard](/trivia/science-nature), drill these kinds of specific-but-forgettable facts. The questions where you "kind of know" the answer are where time bonuses vanish. When in doubt, commit to your first instinct &mdash; the clock is always your real opponent.

Test yourself in [Quick Play mode](/play) with Science & Nature selected, or push your limits in [Marathon mode](/play/marathon).
`,
  },
  {
    slug: "how-daily-trivia-boosts-memory",
    title: "How 10 Minutes of Daily Trivia Actually Boosts Your Memory",
    description:
      "The cognitive science behind daily retrieval practice, why trivia works as a memory exercise, and how to get the most out of it.",
    date: "2026-04-08",
    readingTime: "5 min read",
    author: "The TriviaWorld Team",
    tags: ["learning", "science"],
    content: `
"Use it or lose it" is a cliché, but for memory it's also approximately true. A growing body of research on *retrieval practice* &mdash; the cognitive process of pulling a fact out of memory rather than re-reading it &mdash; suggests that a few minutes of daily trivia does more for your long-term memory than most people realize.

## What retrieval practice does

When you encounter a trivia question, you're not learning new information &mdash; you're retrieving something you already encoded. That retrieval act strengthens the memory more than rereading a textbook would. Psychologists call this the *testing effect*, and it's been replicated across dozens of studies since the 1970s.

The effect is strongest when:

- **Retrieval is effortful.** A question you have to think about for a few seconds does more for memory than one you answer instantly.
- **Retrieval happens over spaced intervals.** Reviewing facts once a day over a week beats reviewing them all in a single session.
- **Feedback is immediate.** Seeing the correct answer right after you answer (right or wrong) locks in the correction.

Daily trivia ticks all three boxes by default.

## Why trivia works better than flashcards

Flashcards work, but they're boring enough that most people stop using them within a week. The trick with daily trivia &mdash; like our [Daily Challenge](/play/daily) &mdash; is that the gamification layer (streaks, scoring, leaderboards) provides the consistency that pure flashcard apps struggle to deliver.

Ten questions a day, five minutes total. If you do that for a year, you've practiced retrieval on ~3,650 facts. That's a lot of memory reinforcement for a near-trivial time investment.

## Practical tips

1. **Pick one category you want to get stronger at.** If you want to brush up on history, play mostly [History trivia](/trivia/history) for a month. The repetition compounds.
2. **Don't look things up mid-game.** It kills the effortful-retrieval benefit. Get the question wrong, read the correct answer, and move on.
3. **Review your wrong answers.** The game's results screen shows every question with the right answer. Scan through them &mdash; the act of looking is itself a micro-retrieval.
4. **Play consistently, not intensely.** Five minutes a day beats an hour once a week.

## A caveat

Retrieval practice makes you better at retrieving the *kinds of facts* you practice. Daily trivia won't make you smarter in some general sense &mdash; but it will make you faster and more reliable at recalling the domains you play in.

Start with today's [Daily Challenge](/play/daily) and see where a week of consistency gets you.
`,
  },
  {
    slug: "hardest-geography-trivia-questions",
    title: "The 10 Hardest Geography Trivia Questions (and Why People Miss Them)",
    description:
      "Ten geography questions that catch even confident players off guard &mdash; plus what each one reveals about the gaps in most people's mental map.",
    date: "2026-04-18",
    readingTime: "6 min read",
    author: "The TriviaWorld Team",
    tags: ["geography", "trivia-strategy"],
    content: `
Geography trivia rewards two things: having actually looked at a map recently, and remembering which country switched names in the last fifty years. Here are ten of the questions that trip up the most players on [Geography](/trivia/geography), and why.

## 1. What is the world's largest country by area that does not border an ocean?

**Answer:** Kazakhstan.

Most people reach for Mongolia, which is the second-largest. Kazakhstan's 2.7 million square kilometers edge it out by a wide margin, but it rarely comes up in popular geography references.

## 2. Which African country has both a Mediterranean and an Atlantic coastline?

**Answer:** Morocco.

Egypt and Tunisia are the instinctive wrong answers &mdash; both are Mediterranean only. Morocco is the only country on the continent that touches both bodies of water.

## 3. What is the only country that is also a continent?

**Answer:** Australia.

This seems obvious until you realize some players argue for Antarctica (not a country) or Greenland (not a continent). The question hinges on the dual classification.

## 4. Istanbul is the largest city in which European country?

**Answer:** Turkey.

The trap is that most of Turkey is in Asia. Istanbul itself straddles the Bosphorus, with roughly two-thirds of its population on the European side, making it the largest European city by population &mdash; larger than Moscow or London.

## 5. Which country has the most time zones?

**Answer:** France.

Russia and the United States are the common guesses. France has twelve time zones when you include its overseas territories, from French Polynesia in the Pacific to its Indian Ocean holdings.

## 6. What is the capital of Australia?

**Answer:** Canberra.

A classic stumper. Sydney and Melbourne both feel like obvious answers because they are bigger and more famous. Canberra was built specifically as a compromise capital in 1913.

## 7. Which river flows through the most countries?

**Answer:** The Danube.

It passes through or borders ten countries &mdash; Germany, Austria, Slovakia, Hungary, Croatia, Serbia, Romania, Bulgaria, Moldova, and Ukraine. The Nile and Amazon are both longer but touch far fewer nations.

## 8. What is the deepest lake in the world?

**Answer:** Lake Baikal.

Located in Siberia, Baikal plunges to 1,642 meters. It also holds about 20% of the world's unfrozen surface fresh water. Players often guess Superior (largest by area) or Tanganyika (second deepest).

## 9. What is the smallest country in South America?

**Answer:** Suriname.

Uruguay is the go-to wrong answer. Suriname clocks in at around 163,000 square kilometers versus Uruguay's 176,000. French Guiana is smaller still but isn't an independent country.

## 10. The strait of Gibraltar separates which two continents?

**Answer:** Europe and Africa.

The trap is that many people instinctively answer "Europe and Asia" because that pairing comes up more often in trivia. Gibraltar is the narrow gap &mdash; about 13 km at its tightest &mdash; where Spain and Morocco nearly touch.

## How to prepare

Geography rewards breadth over depth. You don't need to know the GDP of Togo, but you do need to know *where Togo is*. The fastest way to build that intuition:

- Spend 10 minutes a week on a blank world map and fill in the countries you can't name.
- Drill capitals and name-changes (Myanmar/Burma, Eswatini/Swaziland, Czechia/Czech Republic).
- Play [Geography trivia](/trivia/geography) in [Marathon mode](/play/marathon) &mdash; 50 questions exposes a lot of gaps quickly.

The players who dominate the Geography leaderboard aren't the ones who memorized facts yesterday &mdash; they're the ones who looked at a map often enough that country names trigger mental locations automatically.
`,
  },
  {
    slug: "why-trivia-streaks-break-at-question-seven",
    title: "Why Your Trivia Streak Usually Breaks Around Question 7",
    description:
      "A look at the cognitive load curve in trivia games, why most players stumble in the middle of a run, and how to push past it.",
    date: "2026-04-11",
    readingTime: "5 min read",
    author: "The TriviaWorld Team",
    tags: ["learning", "trivia-strategy"],
    content: `
If you play [Survival mode](/play/survival) regularly, you've probably noticed a pattern: your first few answers feel sharp, you build momentum, and then &mdash; somewhere between question 6 and question 9 &mdash; you fumble one that should have been easy. That's not bad luck. It's cognitive load behaving exactly as psychology predicts.

## The attention curve

Sustained-attention research &mdash; the same body of work behind air-traffic-control staffing and long-haul driving safety &mdash; consistently shows a *vigilance decrement*: a measurable drop in accuracy and reaction time after roughly 5 to 10 minutes of continuous focus on a narrow task. Trivia sits squarely in that window. A 15-second timer multiplied by seven questions is around 90 seconds of *active* retrieval, but the attentional cost is higher than the clock suggests because each question also demands comprehension, evaluation, and commitment.

By question 7, most players have:

- Exhausted their fastest-access memories (the "obvious" answers)
- Accumulated small doses of decision fatigue from the earlier items
- Shifted from confident retrieval to second-guessing

The result is a dip that feels sudden but is actually the predictable end of a ramp.

## Why streaks amplify it

A running streak raises the stakes of every subsequent answer. That's great for engagement, but it adds a second, competing cognitive process: *monitoring the streak itself*. Every correct answer gets you 10% more points in Survival, which is excellent motivation but also an extra thing your working memory is holding while trying to answer the next question.

This is why elite players often report that breaking their own streak record feels harder at question 12 than at question 22 &mdash; by 22 they've either accepted the outcome or settled into flow, and the monitoring overhead drops.

## What to do about it

1. **Treat the first 5 questions as a warmup, not a lead.** Don't rush. A blown time bonus on question 3 costs you less than a wrong answer on question 7.
2. **Take a deliberate breath before question 7.** Literally. It resets attention more than you'd expect, and the timer gives you the slack.
3. **Answer first, doubt second.** The dip is largely caused by re-evaluating a correct first instinct. If you felt confident in the first second, commit.
4. **Practice in the dip zone.** Play [Marathon](/play/marathon) specifically to build stamina past the 10-question mark. The first 10 become trivial with repetition, which frees attention for later questions.

## The caveat

None of this makes you smarter. It makes you less likely to lose a question you actually knew. In trivia, that's usually the entire difference between a decent run and a leaderboard run. The facts you know are the floor; your attention management is the ceiling.
`,
  },
  {
    slug: "climbing-the-triviaworld-leaderboard",
    title: "A Strategic Guide to Climbing the TriviaWorld Leaderboard",
    description:
      "How scoring actually works on TriviaWorld &mdash; difficulty multipliers, time bonuses, streak math &mdash; and which modes give you the best shot at the top.",
    date: "2026-04-04",
    readingTime: "7 min read",
    author: "The TriviaWorld Team",
    tags: ["trivia-strategy", "leaderboard"],
    content: `
The [leaderboard](/leaderboard) looks like a simple high-score list, but the scoring underneath it isn't uniform. Each mode weights difficulty, speed, and streaks differently, and once you know how, picking the right mode for your strengths can matter more than actually getting better at trivia.

## The base formula

Every correct answer earns a base of **100 points**, then gets multiplied by three factors:

- **Difficulty multiplier:** 1x for easy, 1.5x for medium, 2x for hard.
- **Time bonus:** up to +50% in Quick Play and Daily, up to +30% in Marathon and Survival, based on how much of your timer you had left when you locked in.
- **Streak multiplier** (Survival only): +10% per consecutive correct answer, capped at 20.

Wrong answers earn zero. There's no partial credit, no time penalty beyond the opportunity cost.

## What this means per mode

### Quick Play

Formula: base &times; difficulty &times; (1 + timeBonus &times; 0.5)

A hard question answered instantly is worth roughly 300 points. A hard question answered at the last second is worth 200. That's a 50% swing on speed alone, which is why Quick Play rewards decisive players over careful ones. Ten questions, no lives. Clean runs hover in the 2,500&ndash;3,000 range.

### Daily Challenge

Formula: base &times; (1 + timeBonus &times; 0.5)

No difficulty multiplier &mdash; the questions are fixed for everyone that day. This is the most level playing field on the site. Speed is literally the only variable. If you want the most *competitive* daily ranking, this is the mode to focus on because nobody can pick an easier slate than you.

### Marathon

Formula: base &times; 0.8 &times; difficulty &times; (1 + timeBonus &times; 0.3)

Note the 0.8 penalty and the reduced time-bonus cap. Marathon isn't about per-question peak value &mdash; it's about volume. 50 questions, a 30-second timer, and enough length that stamina matters more than raw speed. Top-tier Marathon runs come in around 8,000&ndash;10,000 points, which looks huge but requires sustained focus for several minutes.

### Survival

Formula: base &times; difficulty &times; streakMultiplier &times; (1 + timeBonus &times; 0.3)

This is the highest-ceiling mode. With a capped streak multiplier of 3x on top of a 2x difficulty multiplier, a single hard question mid-streak can crack 700 points. The catch: three wrong answers and you're out. Survival favors specialists &mdash; players with one or two mastered categories who can ride long streaks.

## Strategy implications

1. **Pick your mode based on your strengths.** Fast generalist? Quick Play. Precise and careful? Daily. Patient? Marathon. Deep expertise in a category? Survival.
2. **Chase hard-difficulty questions in Quick Play and Survival.** The 2x multiplier compounds with streaks and time bonuses in a way easy questions never will.
3. **Don't hover.** The time bonus is the easiest points on the board, and dithering for two extra seconds to feel slightly more confident almost never offsets the 10&ndash;15 points you lose.
4. **For Survival: protect the streak early, pursue difficulty late.** The first five questions build the multiplier; the later ones cash it in.
5. **Filter the leaderboard by timeframe.** Daily and weekly leaderboards reset frequently, so a hot week can put you near the top even if the all-time board is out of reach.

## The meta

The players at the top of the [all-time leaderboard](/leaderboard) are almost always Survival specialists &mdash; that mode's ceiling is just too high for the others to compete with on raw points. But if you want *recognition*, the daily and weekly boards turn over constantly, and a single great run can land you on the front page.

Pick a mode, play it for a week, and watch where your natural score range settles. That's your real baseline &mdash; everything after is improvement.
`,
  },
  {
    slug: "movie-trivia-patterns-that-keep-coming-up",
    title: "Movie Trivia: The Patterns That Keep Coming Up",
    description:
      "Film trivia looks infinite, but the same question shapes appear over and over. Here are the recurring patterns and how to prepare for them.",
    date: "2026-03-28",
    readingTime: "6 min read",
    author: "The TriviaWorld Team",
    tags: ["film", "trivia-strategy"],
    content: `
There are roughly half a million feature films in existence. Trivia writers could theoretically draw from any of them, but in practice, [Film](/trivia/film) questions follow a small set of recurring shapes. Learn the shapes and you'll stop feeling like you need to have seen every movie ever made.

## Pattern 1: Best Picture streaks and droughts

Oscars trivia is the reliable backbone of movie categories. Questions about Best Picture winners, especially from the last 30 years, come up constantly. Worth memorizing:

- Every Best Picture winner since 2000
- Films that swept (5+ major wins): *Titanic*, *The Lord of the Rings: The Return of the King*, *La La Land* (*almost*), *Everything Everywhere All at Once*
- Notable upsets and near-misses (*Crash* over *Brokeback Mountain* still appears regularly)

## Pattern 2: Directors with small filmographies

When a director has only made three or four films, any of them becomes a reasonable question. The prime examples:

- Terrence Malick (early career)
- Jordan Peele
- Greta Gerwig
- Stanley Kubrick (distinctive enough that "which Kubrick film&hellip;" always shows up)
- Quentin Tarantino (who famously plans to retire at ten)

Conversely, directors with sixty films &mdash; Woody Allen, Clint Eastwood, Steven Spielberg &mdash; generate questions too, but they center on *specific* titles rather than "which director made&hellip;"

## Pattern 3: The famous misattributed quote

"Play it again, Sam" was never said in *Casablanca*. "Luke, I am your father" is actually "*No, I am your father*." "Beam me up, Scotty" wasn't in any Star Trek film or episode. Trivia loves these because they feel obvious and wrong at the same time.

## Pattern 4: Casting-change questions

Who was originally cast? Who turned it down? These questions reward a certain kind of movie-blog consumer:

- Tom Selleck was initially cast as Indiana Jones.
- Will Smith turned down Neo in *The Matrix*.
- Sean Connery turned down Gandalf.
- Michelle Pfeiffer was the original choice for Clarice Starling in *The Silence of the Lambs*.

## Pattern 5: Box office milestones

A handful of records get referenced endlessly:

- *Avatar* (2009) vs. *Avengers: Endgame* vs. *Avatar: The Way of Water* for highest-grossing
- *Titanic* held the top spot for 12 years
- *Gone with the Wind* adjusted for inflation
- First film to cross $1 billion: *Titanic*

## Pattern 6: The single-franchise stumper

These questions lean on encyclopedic knowledge of a specific universe &mdash; Marvel, *Star Wars*, *Harry Potter*, the *Fast &amp; Furious* series. If you're casually into a franchise, you'll usually get these. If not, skip and save the time.

## Pattern 7: Foreign-language landmarks

Trivia wants you to know a handful of internationally celebrated films even if you've never watched them:

- *Parasite* (2019) &mdash; first non-English Best Picture winner
- *Seven Samurai* &mdash; endlessly referenced
- *Amélie* &mdash; the reliable "French film" answer
- *Pan's Labyrinth* and *Roma* &mdash; Guillermo del Toro and Alfonso Cuarón come up constantly

## How to prepare

Don't try to watch more movies &mdash; that's the slow path. Instead:

- Read Best Picture winner lists and skim the Wikipedia summaries
- Know the ten or so most-misquoted movie lines
- Have a one-sentence handle on every Coen, Nolan, Tarantino, Spielberg, and Kubrick film

Test yourself with [Film trivia](/trivia/film) in [Quick Play](/play). If you run into a question and realize you've never heard of the movie in question, that's a signal the film is famous enough that it's worth a five-minute read later. Trivia isn't about knowing everything; it's about pattern-matching fast on the things that come up.
`,
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
}
