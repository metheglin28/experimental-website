export function notificationsSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function notificationPermission(): NotificationPermission | 'unsupported' {
  return notificationsSupported() ? Notification.permission : 'unsupported';
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!notificationsSupported()) return 'denied';
  return Notification.requestPermission();
}

export function notify(title: string, options?: NotificationOptions): void {
  if (!notificationsSupported() || Notification.permission !== 'granted') return;
  try {
    const n = new Notification(title, { icon: '/icons/icon-192.png', ...options });
    n.onclick = () => {
      window.focus();
      n.close();
    };
  } catch {
    // Some browsers (notably mobile Safari) throw when constructing a
    // Notification directly instead of via a service worker — fail quietly.
  }
}
