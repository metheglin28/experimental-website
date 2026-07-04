import { PiggyBank } from 'lucide-react';
import { useFinanceStore } from '@/store/finance';
import { GoalCard } from './GoalCard';
import { EmptyState } from '@/components/ui/EmptyState';

export function GoalsList() {
  const goals = useFinanceStore((s) => s.goals);

  if (goals.length === 0) {
    return <EmptyState icon={PiggyBank} title="No hoards started yet" description="Set a target — an emergency fund, a trip, a new laptop — and start stacking your hoard." />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {goals.map((g) => (
        <GoalCard key={g.id} goal={g} />
      ))}
    </div>
  );
}
