import { useRef, useState } from 'react';
import { Sun, Moon, Laptop, Download, Upload, Trash2, ShieldCheck, Check, Bell } from 'lucide-react';
import clsx from 'clsx';
import { useSettingsStore, CURRENCIES, type ThemeMode, type Accent } from '@/store/settings';
import { downloadBackup, importBackup, wipeAllData } from '@/lib/backup';
import { notificationsSupported, notificationPermission, requestNotificationPermission, notify } from '@/lib/notify';

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Laptop },
];

// Swatch previews use fixed hex values rather than bg-honey-400 etc.
// because selecting an accent remaps the --color-honey-* variables to
// that accent's palette app-wide — so the "Honey" swatch itself would
// silently take on whatever accent was active if it used that class.
const ACCENT_OPTIONS: { value: Accent; label: string; hex: string }[] = [
  { value: 'honey', label: 'Honey', hex: '#f6ab33' },
  { value: 'ember', label: 'Ember', hex: '#f0765a' },
  { value: 'moss', label: 'Moss', hex: '#8fbc5f' },
  { value: 'frost', label: 'Frost', hex: '#4ab8db' },
];

export function Settings() {
  const {
    themeMode,
    setThemeMode,
    accent,
    setAccent,
    displayName,
    setDisplayName,
    currency,
    setCurrency,
    notificationsEnabled,
    setNotificationsEnabled,
  } = useSettingsStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importMessage, setImportMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [confirmWipe, setConfirmWipe] = useState(false);
  const [justExported, setJustExported] = useState(false);
  const [notifPermission, setNotifPermission] = useState(notificationPermission());

  async function handleToggleNotifications() {
    if (notificationsEnabled) {
      setNotificationsEnabled(false);
      return;
    }
    const result = await requestNotificationPermission();
    setNotifPermission(result);
    if (result === 'granted') {
      setNotificationsEnabled(true);
      notify('Notifications are on', {
        body: "We'll let you know when a focus session ends, and nudge you once a day about tasks due today.",
      });
    }
  }

  function handleExport() {
    downloadBackup();
    setJustExported(true);
    setTimeout(() => setJustExported(false), 2000);
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = importBackup(String(reader.result));
      if (result.ok) {
        setImportMessage({ ok: true, text: 'Backup restored. Reloading…' });
        setTimeout(() => window.location.reload(), 900);
      } else {
        setImportMessage({ ok: false, text: result.error });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function handleWipe() {
    if (!confirmWipe) {
      setConfirmWipe(true);
      return;
    }
    wipeAllData();
    window.location.reload();
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="card flex flex-col gap-4 p-5">
        <h3 className="font-display text-sm font-semibold text-ink-700 dark:text-ink-200">Profile</h3>
        <label className="flex flex-col gap-1 text-xs font-medium text-ink-500">
          What should we call you?
          <input
            className="input"
            placeholder="Your name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-ink-500">
          Currency
          <select className="input w-40" value={currency} onChange={(e) => setCurrency(e.target.value as (typeof CURRENCIES)[number])}>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="card flex flex-col gap-4 p-5">
        <h3 className="font-display text-sm font-semibold text-ink-700 dark:text-ink-200">Appearance</h3>
        <div>
          <p className="mb-2 text-xs font-medium text-ink-500">Theme</p>
          <div className="flex gap-2">
            {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setThemeMode(value)}
                className={clsx(
                  'flex flex-1 flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-xs font-medium transition',
                  themeMode === value
                    ? 'border-honey-400 bg-honey-400/15 text-honey-800 dark:text-honey-200'
                    : 'border-ink-200 text-ink-500 hover:bg-ink-900/5 dark:border-ink-700 dark:hover:bg-white/5',
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-medium text-ink-500">Accent color</p>
          <div className="flex gap-3">
            {ACCENT_OPTIONS.map(({ value, label, hex }) => (
              <button
                key={value}
                onClick={() => setAccent(value)}
                className="flex flex-col items-center gap-1.5"
                title={label}
              >
                <span
                  style={{ backgroundColor: hex }}
                  className={clsx(
                    'flex h-9 w-9 items-center justify-center rounded-full ring-offset-2 ring-offset-white transition dark:ring-offset-ink-900',
                    accent === value && 'ring-2 ring-ink-900 dark:ring-honey-50',
                  )}
                >
                  {accent === value && <Check className="h-4 w-4 text-white" />}
                </span>
                <span className="text-[11px] text-ink-500">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card flex flex-col gap-3 p-5">
        <h3 className="font-display text-sm font-semibold text-ink-700 dark:text-ink-200">Notifications</h3>
        <p className="text-xs text-ink-500">
          Get a browser notification when a focus session ends, and a once-a-day nudge for tasks due today — only
          while Meadhall is open in a tab. There's no push service, so nothing arrives while it's closed.
        </p>
        {!notificationsSupported() ? (
          <p className="text-xs text-ink-400">Not supported in this browser.</p>
        ) : notifPermission === 'denied' ? (
          <p className="text-xs text-ember-600 dark:text-ember-400">
            Notifications are blocked for this site. Allow them in your browser's site settings to turn this on.
          </p>
        ) : (
          <button
            onClick={handleToggleNotifications}
            className={clsx('btn-secondary self-start', notificationsEnabled && '!bg-honey-400/25 !text-honey-800 dark:!text-honey-200')}
          >
            <Bell className="h-4 w-4" />
            {notificationsEnabled ? 'Notifications on' : 'Turn on notifications'}
          </button>
        )}
      </div>

      <div className="card flex flex-col gap-4 p-5">
        <h3 className="font-display text-sm font-semibold text-ink-700 dark:text-ink-200">Your data</h3>
        <div className="flex items-start gap-2.5 rounded-xl bg-honey-400/10 px-3.5 py-3 text-xs text-ink-600 dark:text-ink-300">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-honey-500" />
          <p>
            Everything you enter — tasks, notes, habits, journal entries, bookmarks, finances — is stored only in this
            browser's local storage. Nothing is sent anywhere. Export a backup regularly, especially before clearing
            your browser data.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleExport} className="btn-secondary">
            {justExported ? <Check className="h-4 w-4 text-moss-500" /> : <Download className="h-4 w-4" />}
            Export backup
          </button>
          <button onClick={handleImportClick} className="btn-secondary">
            <Upload className="h-4 w-4" />
            Import backup
          </button>
          <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleFileChange} />
          <button
            onClick={handleWipe}
            onBlur={() => setConfirmWipe(false)}
            className="btn-danger ml-auto"
          >
            <Trash2 className="h-4 w-4" />
            {confirmWipe ? 'Click again to confirm' : 'Reset all data'}
          </button>
        </div>
        {importMessage && (
          <p className={clsx('text-xs', importMessage.ok ? 'text-moss-600 dark:text-moss-400' : 'text-ember-600 dark:text-ember-400')}>
            {importMessage.text}
          </p>
        )}
      </div>

      <p className="text-center text-xs text-ink-300">Meadhall · your private hall</p>
    </div>
  );
}
