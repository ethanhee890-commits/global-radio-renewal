const SAFE_NETWORK_PROTOCOLS = new Set(['http:', 'https:']);

export function getSafeNetworkUrl(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }

  try {
    const url = new URL(trimmed);
    return SAFE_NETWORK_PROTOCOLS.has(url.protocol) ? url.toString() : '';
  } catch {
    return '';
  }
}

export function isSafeNetworkUrl(value: unknown): boolean {
  return Boolean(getSafeNetworkUrl(value));
}

export function getSafeHttpsUrl(value: unknown): string {
  const url = getSafeNetworkUrl(value);
  return url.startsWith('https://') ? url : '';
}
