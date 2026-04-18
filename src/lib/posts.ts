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
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
}
