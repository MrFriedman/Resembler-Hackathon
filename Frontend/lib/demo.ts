/**
 * Demo mode is the default path for a Vercel deploy with no environment variables.
 * It is on when NEXT_PUBLIC_DEMO_MODE is truthy, and also when that flag is unset
 * and NEXT_PUBLIC_API_URL is empty. Set NEXT_PUBLIC_DEMO_MODE=false to call Flask.
 */
export function isDemoMode(): boolean {
  const flag = readFlag(process.env.NEXT_PUBLIC_DEMO_MODE);
  if (flag !== null) return flag;
  return getApiBase() === null;
}

export function getApiBase(): string | null {
  return readUrl(process.env.NEXT_PUBLIC_API_URL);
}

function readFlag(value: string | undefined): boolean | null {
  if (value == null) return null;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  return null;
}

function readUrl(value: string | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.replace(/\/$/, "") : null;
}
