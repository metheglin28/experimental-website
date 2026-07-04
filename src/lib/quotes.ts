const QUOTES: { text: string; author: string }[] = [
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { text: 'Small daily improvements are the key to staggering long-term results.', author: 'James Clear' },
  { text: 'Well begun is half done.', author: 'Aristotle' },
  { text: 'What we do every day matters more than what we do once in a while.', author: 'Gretchen Rubin' },
  { text: 'You do not rise to the level of your goals. You fall to the level of your systems.', author: 'James Clear' },
  { text: 'Discipline is choosing between what you want now and what you want most.', author: 'Abraham Lincoln' },
  { text: 'A year from now you may wish you had started today.', author: 'Karen Lamb' },
  { text: 'The way to get started is to quit talking and begin doing.', author: 'Walt Disney' },
  { text: 'Focus on being productive instead of busy.', author: 'Tim Ferriss' },
  { text: 'Slow is smooth, and smooth is fast.', author: 'Navy SEAL adage' },
  { text: 'Done is better than perfect.', author: 'Sheryl Sandberg' },
  { text: 'The best time to plant a tree was 20 years ago. The second best time is now.', author: 'Chinese proverb' },
  { text: 'Amateurs sit and wait for inspiration, the rest of us just get up and go to work.', author: 'Stephen King' },
  { text: 'Your future is created by what you do today, not tomorrow.', author: 'Robert Kiyosaki' },
  { text: 'Rest when you’re weary. Refresh and renew yourself. Then get back to work.', author: 'Ralph Marston' },
  { text: 'It always seems impossible until it’s done.', author: 'Nelson Mandela' },
  { text: 'Progress, not perfection.', author: 'Anonymous' },
  { text: 'One day or day one. You decide.', author: 'Anonymous' },
  { text: 'Little by little, a little becomes a lot.', author: 'Tanzanian proverb' },
  { text: 'Energy and persistence conquer all things.', author: 'Benjamin Franklin' },
  { text: 'The mind is everything. What you think you become.', author: 'Buddha' },
  { text: 'Action is the foundational key to all success.', author: 'Pablo Picasso' },
  { text: 'Don’t watch the clock; do what it does. Keep going.', author: 'Sam Levenson' },
  { text: 'Start where you are. Use what you have. Do what you can.', author: 'Arthur Ashe' },
  { text: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci' },
  { text: 'Take care of your body. It’s the only place you have to live.', author: 'Jim Rohn' },
  { text: 'The journey of a thousand miles begins with a single step.', author: 'Lao Tzu' },
  { text: 'Almost everything will work again if you unplug it for a few minutes, including you.', author: 'Anne Lamott' },
  { text: 'Ideas are easy. Implementation is hard.', author: 'Guy Kawasaki' },
  { text: 'Consistency is what transforms average into excellence.', author: 'Anonymous' },
];

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / 86_400_000);
}

export function quoteOfTheDay(date: Date = new Date()): { text: string; author: string } {
  return QUOTES[dayOfYear(date) % QUOTES.length];
}
