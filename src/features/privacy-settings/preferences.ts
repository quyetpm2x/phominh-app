export const MESSAGE_AUDIENCES = {
  neighborhood: { label: 'Khu phố', detail: 'Người trong khu phố và danh bạ' },
  acquaintances: { label: 'Người quen', detail: 'Chỉ người trong danh bạ của bạn' },
  nobody: { label: 'Không ai', detail: 'Không nhận tin nhắn mới' },
} as const;
export type MessageAudience = keyof typeof MESSAGE_AUDIENCES;
export interface PrivacyPreferences {
  approximateDistance: boolean;
  hideHome: boolean;
  discoverable: boolean;
  online: boolean;
  messageAudience: MessageAudience;
}
export const DEFAULT_PREFERENCES: PrivacyPreferences = {
  approximateDistance: true,
  hideHome: true,
  discoverable: true,
  online: false,
  messageAudience: 'neighborhood',
};
export function restorePreferences(raw: string | null): PrivacyPreferences {
  const result = { ...DEFAULT_PREFERENCES };
  try {
    const value: unknown = JSON.parse(raw ?? 'null');
    if (!value || typeof value !== 'object') return result;
    const p = value as Record<string, unknown>;
    for (const key of ['approximateDistance', 'hideHome', 'discoverable', 'online'] as const) {
      if (typeof p[key] === 'boolean') result[key] = p[key];
    }
    if (typeof p.messageAudience === 'string' && Object.hasOwn(MESSAGE_AUDIENCES, p.messageAudience)) {
      result.messageAudience = p.messageAudience as MessageAudience;
    }
  } catch {
    /* Keep defaults for unreadable stored data. */
  }
  return result;
}
