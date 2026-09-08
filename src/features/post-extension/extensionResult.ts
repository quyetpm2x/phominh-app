export interface ExtensionResult {
  postId: string;
  hours: 12 | 24 | 48;
  boost: boolean;
  expiresAt: number;
}

export function createExtensionResult(
  postId: string,
  hours: ExtensionResult['hours'],
  boost: boolean,
  remainingHours: number,
  previousExpiry?: number,
  now = Date.now(),
): ExtensionResult {
  const base = Math.max(now, previousExpiry ?? now + Math.max(0, remainingHours) * 3_600_000);
  return { postId, hours, boost, expiresAt: base + hours * 3_600_000 };
}

export function formatExtensionExpiry(expiresAt: number, now = new Date()) {
  const expiry = new Date(expiresAt);
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const day =
    expiry.toDateString() === now.toDateString()
      ? 'Hôm nay'
      : expiry.toDateString() === tomorrow.toDateString()
        ? 'Ngày mai'
        : `${expiry.getDate()}/${expiry.getMonth() + 1}/${expiry.getFullYear()}`;
  return `${String(expiry.getHours()).padStart(2, '0')}:${String(expiry.getMinutes()).padStart(2, '0')} • ${day}`;
}
