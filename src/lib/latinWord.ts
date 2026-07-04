const LATIN_WORDS: { word: string; translation: string }[] = [
  { word: 'Sapientia', translation: 'wisdom' },
  { word: 'Fortis', translation: 'strong, brave' },
  { word: 'Lux', translation: 'light' },
  { word: 'Veritas', translation: 'truth' },
  { word: 'Tempus', translation: 'time' },
  { word: 'Labor', translation: 'work' },
  { word: 'Spes', translation: 'hope' },
  { word: 'Fides', translation: 'faith, trust' },
  { word: 'Vita', translation: 'life' },
  { word: 'Mens', translation: 'mind' },
  { word: 'Ars', translation: 'art, skill' },
  { word: 'Scientia', translation: 'knowledge' },
  { word: 'Virtus', translation: 'virtue, courage' },
  { word: 'Quies', translation: 'rest, quiet' },
  { word: 'Ordo', translation: 'order' },
  { word: 'Cura', translation: 'care, attention' },
  { word: 'Pax', translation: 'peace' },
  { word: 'Aequanimitas', translation: 'even-mindedness, calm' },
  { word: 'Perseverantia', translation: 'perseverance' },
  { word: 'Diligentia', translation: 'diligence, carefulness' },
  { word: 'Constantia', translation: 'steadfastness, consistency' },
  { word: 'Initium', translation: 'beginning' },
  { word: 'Finis', translation: 'end, goal' },
  { word: 'Iter', translation: 'journey, path' },
  { word: 'Domus', translation: 'home' },
  { word: 'Amicitia', translation: 'friendship' },
  { word: 'Memoria', translation: 'memory' },
  { word: 'Ratio', translation: 'reason, method' },
  { word: 'Consilium', translation: 'plan, counsel' },
  { word: 'Opus', translation: 'a work, a creation' },
  { word: 'Studium', translation: 'zeal, study' },
  { word: 'Hodie', translation: 'today' },
  { word: 'Cras', translation: 'tomorrow' },
  { word: 'Semper', translation: 'always' },
  { word: 'Simplex', translation: 'simple' },
  { word: 'Libertas', translation: 'freedom' },
  { word: 'Gratia', translation: 'grace, gratitude' },
  { word: 'Fortuna', translation: 'fortune, luck' },
  { word: 'Aurum', translation: 'gold' },
  { word: 'Mel', translation: 'honey' },
];

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / 86_400_000);
}

export function latinWordOfTheDay(date: Date = new Date()): { word: string; translation: string } {
  return LATIN_WORDS[dayOfYear(date) % LATIN_WORDS.length];
}
