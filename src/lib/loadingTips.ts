/** Original loading-screen-style tips — a wink at a certain dragon-shouting
 * RPG's habit of teaching you to play while you wait. */
const LOADING_TIPS = [
  'Tip: Even dragonslayers keep a to-do list.',
  'Tip: A streak, once broken, can always be reforged.',
  'Tip: The shortest path to a goal is a habit walked daily.',
  'Tip: A well-kept ledger fears no dragon.',
  'Tip: Press ⌘K to shout your next command into being.',
  'Tip: Every great hall was built one log at a time.',
  'Tip: Rest is a skill too — schedule it.',
  'Tip: Small quests, completed daily, slay the largest dragons.',
  'Tip: A journal entry a day keeps the memory sharp.',
  'Tip: Your hoard of savings grows one coin at a time.',
];

export function randomLoadingTip(): string {
  return LOADING_TIPS[Math.floor(Math.random() * LOADING_TIPS.length)];
}
