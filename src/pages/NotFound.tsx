import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <Compass className="h-10 w-10 text-honey-500" />
      <h2 className="font-display text-2xl font-semibold text-ink-900 dark:text-honey-50">
        This corner of the hall is empty
      </h2>
      <p className="max-w-sm text-sm text-ink-500">
        Nothing lives at this address. Let's get you back to somewhere familiar.
      </p>
      <Link to="/" className="btn-primary mt-2">
        Return to the Dashboard
      </Link>
    </div>
  );
}
