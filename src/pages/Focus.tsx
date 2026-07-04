import { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Flame } from 'lucide-react';
import { useFocusStore, focusMinutesByDay, type Phase } from '@/store/focus';
import { TimerRing } from '@/components/focus/TimerRing';
import { FocusHistoryChart } from '@/components/focus/FocusHistoryChart';
import { dayKey } from '@/lib/date';

function phaseSeconds(phase: Phase, s: ReturnType<typeof useFocusStore.getState>): number {
  if (phase === 'focus') return s.focusMinutes * 60;
  if (phase === 'short-break') return s.shortBreakMinutes * 60;
  return s.longBreakMinutes * 60;
}

export function Focus() {
  const store = useFocusStore();
  const { focusMinutes, shortBreakMinutes, longBreakMinutes, sessionsUntilLongBreak, sessions, setDurations, logSession } = store;

  const [phase, setPhase] = useState<Phase>('focus');
  const [remaining, setRemaining] = useState(() => phaseSeconds('focus', store));
  const [running, setRunning] = useState(false);
  const endTimeRef = useRef<number | null>(null);

  const total = phaseSeconds(phase, store);
  const today = dayKey();
  const todayFocusSessions = sessions.filter((s) => s.day === today && s.phase === 'focus').length;
  const todayMinutes = sessions.filter((s) => s.day === today && s.phase === 'focus').reduce((a, b) => a + b.minutes, 0);

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      if (endTimeRef.current == null) return;
      const secondsLeft = Math.round((endTimeRef.current - Date.now()) / 1000);
      if (secondsLeft <= 0) {
        completePhase();
      } else {
        setRemaining(secondsLeft);
      }
    };
    const interval = window.setInterval(tick, 250);
    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  function completePhase() {
    setRunning(false);
    if (phase === 'focus') {
      logSession('focus', focusMinutes);
      const completedToday = todayFocusSessions + 1;
      const next: Phase = completedToday % sessionsUntilLongBreak === 0 ? 'long-break' : 'short-break';
      setPhase(next);
      setRemaining(phaseSeconds(next, store));
    } else {
      logSession(phase, phase === 'short-break' ? shortBreakMinutes : longBreakMinutes);
      setPhase('focus');
      setRemaining(phaseSeconds('focus', store));
    }
  }

  function handleStartPause() {
    if (running) {
      if (endTimeRef.current != null) {
        setRemaining(Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000)));
      }
      setRunning(false);
    } else {
      endTimeRef.current = Date.now() + remaining * 1000;
      setRunning(true);
    }
  }

  function handleReset() {
    setRunning(false);
    setRemaining(phaseSeconds(phase, store));
  }

  function handleSkip() {
    setRunning(false);
    const next: Phase = phase === 'focus' ? 'short-break' : 'focus';
    setPhase(next);
    setRemaining(phaseSeconds(next, store));
  }

  function switchPhase(p: Phase) {
    setRunning(false);
    setPhase(p);
    setRemaining(phaseSeconds(p, store));
  }

  const chartData = focusMinutesByDay(sessions, 7);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="card flex flex-col items-center gap-6 p-8">
        <div className="flex gap-1 rounded-xl border border-ink-200 p-1 text-xs dark:border-ink-800">
          {(['focus', 'short-break', 'long-break'] as Phase[]).map((p) => (
            <button
              key={p}
              onClick={() => switchPhase(p)}
              className={`rounded-lg px-3 py-1.5 font-medium transition ${
                phase === p ? 'bg-honey-400/20 text-honey-800 dark:text-honey-200' : 'text-ink-400'
              }`}
            >
              {p === 'focus' ? 'Focus' : p === 'short-break' ? 'Short break' : 'Long break'}
            </button>
          ))}
        </div>

        <TimerRing phase={phase} remaining={remaining} total={total} />

        <div className="flex items-center gap-3">
          <button onClick={handleReset} className="icon-btn h-11 w-11" title="Reset">
            <RotateCcw className="h-5 w-5" />
          </button>
          <button
            onClick={handleStartPause}
            className="btn-primary h-14 w-14 rounded-full !p-0 text-lg"
            title={running ? 'Pause' : 'Start'}
          >
            {running ? <Pause className="h-6 w-6" /> : <Play className="ml-0.5 h-6 w-6" />}
          </button>
          <button onClick={handleSkip} className="icon-btn h-11 w-11" title="Skip">
            <SkipForward className="h-5 w-5" />
          </button>
        </div>

        <p className="inline-flex items-center gap-1.5 text-sm text-ink-500">
          <Flame className="h-4 w-4 text-honey-500" />
          {todayFocusSessions} session{todayFocusSessions === 1 ? '' : 's'} · {todayMinutes} min focused today
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="card p-5">
          <h3 className="mb-3 font-display text-sm font-semibold text-ink-700 dark:text-ink-200">Last 7 days</h3>
          <FocusHistoryChart data={chartData} />
        </div>

        <div className="card flex flex-col gap-3 p-5">
          <h3 className="font-display text-sm font-semibold text-ink-700 dark:text-ink-200">Durations</h3>
          <label className="flex items-center justify-between text-sm text-ink-500">
            Focus
            <input
              type="number"
              min={1}
              max={180}
              className="input w-20 py-1 text-right"
              value={focusMinutes}
              onChange={(e) => setDurations({ focusMinutes: Number(e.target.value) || 1 })}
            />
          </label>
          <label className="flex items-center justify-between text-sm text-ink-500">
            Short break
            <input
              type="number"
              min={1}
              max={60}
              className="input w-20 py-1 text-right"
              value={shortBreakMinutes}
              onChange={(e) => setDurations({ shortBreakMinutes: Number(e.target.value) || 1 })}
            />
          </label>
          <label className="flex items-center justify-between text-sm text-ink-500">
            Long break
            <input
              type="number"
              min={1}
              max={90}
              className="input w-20 py-1 text-right"
              value={longBreakMinutes}
              onChange={(e) => setDurations({ longBreakMinutes: Number(e.target.value) || 1 })}
            />
          </label>
          <label className="flex items-center justify-between text-sm text-ink-500">
            Sessions / long break
            <input
              type="number"
              min={2}
              max={12}
              className="input w-20 py-1 text-right"
              value={sessionsUntilLongBreak}
              onChange={(e) => setDurations({ sessionsUntilLongBreak: Number(e.target.value) || 2 })}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
